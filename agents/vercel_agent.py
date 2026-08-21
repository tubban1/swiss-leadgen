"""
Vercel Deploy Agent
部署静态网站，绑定自定义子域名
"""
import time
import requests
from config import VERCEL_TOKEN, VERCEL_TEAM_ID, ROOT_DOMAIN, GITHUB_ORG


class VercelAgent:
    BASE = "https://api.vercel.com"

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {VERCEL_TOKEN}",
            "Content-Type": "application/json",
        }
        self.team_params = {"teamId": VERCEL_TEAM_ID} if VERCEL_TEAM_ID else {}
        self._github_owner = GITHUB_ORG or self._get_github_username()

    def _get_github_username(self) -> str:
        from config import GITHUB_TOKEN
        r = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {GITHUB_TOKEN}"}
        )
        r.raise_for_status()
        return r.json()["login"]

    # ── Project ──────────────────────────────────────────

    def get_or_create_project(self, repo_name: str) -> dict:
        """
        创建 Vercel Project，连接 GitHub Repo
        如果已存在则直接返回
        """
        project_name = repo_name  # 与 repo 同名

        # 先检查是否存在
        r = requests.get(
            f"{self.BASE}/v9/projects/{project_name}",
            headers=self.headers, params=self.team_params
        )
        if r.status_code == 200:
            print(f"   Vercel project {project_name} 已存在")
            return r.json()

        # 创建新 project，连接 GitHub
        payload = {
            "name": project_name,
            "gitRepository": {
                "type": "github",
                "repo": f"{self._github_owner}/{repo_name}",
            },
            "framework": None,  # 纯静态，不用框架
            "rootDirectory": None,
            "outputDirectory": None,
        }
        r = requests.post(
            f"{self.BASE}/v10/projects",
            headers=self.headers,
            params=self.team_params,
            json=payload,
        )
        r.raise_for_status()
        print(f"✅ Vercel project 创建: {project_name}")
        return r.json()

    # ── Deploy ───────────────────────────────────────────

    def trigger_deployment(self, repo_name: str) -> dict:
        """触发部署（通过 Git integration）"""
        payload = {
            "name": repo_name,
            "gitSource": {
                "type": "github",
                "repoId": None,  # Vercel 会从 project 关联中获取
                "ref": "main",
            },
            "projectSettings": {
                "framework": None,
            },
            "target": "production",
        }
        # 使用 v13 deployments API
        r = requests.post(
            f"{self.BASE}/v13/deployments",
            headers=self.headers,
            params={**self.team_params, "forceNew": 1},
            json=payload,
        )
        r.raise_for_status()
        deployment = r.json()
        print(f"🚀 部署触发: {deployment.get('id')}")
        return deployment

    def wait_for_deployment(self, deployment_id: str, timeout: int = 300) -> str:
        """轮询等待部署完成，返回部署 URL"""
        deadline = time.time() + timeout
        print(f"⏳ 等待 Vercel 部署完成...")
        while time.time() < deadline:
            r = requests.get(
                f"{self.BASE}/v13/deployments/{deployment_id}",
                headers=self.headers,
                params=self.team_params,
            )
            r.raise_for_status()
            data = r.json()
            state = data.get("readyState") or data.get("status")
            if state in ("READY", "ready"):
                url = data.get("url") or data.get("alias", [""])[0]
                print(f"✅ 部署完成: https://{url}")
                return f"https://{url}"
            elif state in ("ERROR", "CANCELED"):
                raise RuntimeError(f"Vercel 部署失败: {state}")
            time.sleep(10)
        raise TimeoutError("Vercel 部署超时")

    # ── Domain ───────────────────────────────────────────

    def add_domain(self, project_name: str, subdomain: str) -> dict:
        """
        为 Vercel project 添加自定义域名
        subdomain = "bakerei-muller.tubban.com"
        """
        r = requests.post(
            f"{self.BASE}/v10/projects/{project_name}/domains",
            headers=self.headers,
            params=self.team_params,
            json={"name": subdomain},
        )
        data = r.json()
        if r.status_code in (200, 409):  # 409 = 已存在
            print(f"✅ Vercel 域名绑定: {subdomain}")
            return data
        r.raise_for_status()
        return data

    def get_domain_config(self, project_name: str, subdomain: str) -> dict:
        """获取 Vercel 要求的 DNS 配置（CNAME 指向值）"""
        r = requests.get(
            f"{self.BASE}/v10/projects/{project_name}/domains/{subdomain}",
            headers=self.headers,
            params=self.team_params,
        )
        r.raise_for_status()
        return r.json()

    # ── Main ─────────────────────────────────────────────

    def run(self, repo_name: str, slug: str) -> dict:
        """
        主入口：创建 project → 触发部署 → 绑定子域名
        返回 { project_id, vercel_url, subdomain, cname_value }
        """
        subdomain = f"{slug}.{ROOT_DOMAIN}"
        print(f"\n▲  Vercel: {repo_name} → {subdomain}")

        project = self.get_or_create_project(repo_name)
        project_id = project["id"]
        project_name = project["name"]

        deployment = self.trigger_deployment(project_name)
        vercel_url = self.wait_for_deployment(deployment["id"])

        domain_info = self.add_domain(project_name, subdomain)

        # 获取 Vercel 提供的 CNAME 值（用于 GoDaddy 配置）
        cname_value = "cname.vercel-dns.com"  # Vercel 标准 CNAME
        # 如果 domain_info 有具体值则用那个
        if "cname" in domain_info:
            cname_value = domain_info["cname"]

        return {
            "project_id": project_id,
            "project_name": project_name,
            "vercel_url": vercel_url,
            "subdomain": subdomain,
            "cname_value": cname_value,
        }
