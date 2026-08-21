"""
GitHub Agent
创建私有 Repo 并 push 网站静态文件
"""
import base64
import json
import requests
from pathlib import Path
from config import GITHUB_TOKEN, GITHUB_ORG


class GitHubAgent:
    BASE = "https://api.github.com"

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        # 确认用户名（个人账号）
        self._owner = GITHUB_ORG or self._get_username()

    def _get_username(self) -> str:
        r = requests.get(f"{self.BASE}/user", headers=self.headers)
        r.raise_for_status()
        return r.json()["login"]

    def _repo_exists(self, repo_name: str) -> bool:
        r = requests.get(
            f"{self.BASE}/repos/{self._owner}/{repo_name}",
            headers=self.headers
        )
        return r.status_code == 200

    def create_repo(self, repo_name: str) -> dict:
        """创建私有 Repo，返回 repo 信息"""
        if self._repo_exists(repo_name):
            print(f"   Repo {repo_name} 已存在，跳过创建")
            r = requests.get(f"{self.BASE}/repos/{self._owner}/{repo_name}", headers=self.headers)
            return r.json()

        payload = {
            "name": repo_name,
            "private": True,
            "description": "Auto-generated site by Swiss LeadGen",
            "auto_init": False,
        }
        # 如果是组织账号
        if GITHUB_ORG:
            url = f"{self.BASE}/orgs/{GITHUB_ORG}/repos"
        else:
            url = f"{self.BASE}/user/repos"

        r = requests.post(url, headers=self.headers, json=payload)
        r.raise_for_status()
        print(f"✅ GitHub Repo 创建: {repo_name}")
        return r.json()

    def push_files(self, repo_name: str, site_dir: Path):
        """
        将 site_dir 目录下的所有文件 push 到 Repo main 分支
        使用 GitHub Contents API（逐文件上传，适合小型静态网站）
        """
        files = list(site_dir.rglob("*"))
        pushed = 0
        for file_path in files:
            if file_path.is_dir():
                continue
            rel = file_path.relative_to(site_dir)
            content = file_path.read_bytes()
            encoded = base64.b64encode(content).decode()

            # 检查文件是否已存在（获取 sha 用于更新）
            check = requests.get(
                f"{self.BASE}/repos/{self._owner}/{repo_name}/contents/{rel}",
                headers=self.headers,
            )
            sha = check.json().get("sha") if check.status_code == 200 else None

            payload = {
                "message": f"add {rel}",
                "content": encoded,
            }
            if sha:
                payload["sha"] = sha

            r = requests.put(
                f"{self.BASE}/repos/{self._owner}/{repo_name}/contents/{rel}",
                headers=self.headers,
                json=payload,
            )
            r.raise_for_status()
            pushed += 1

        print(f"✅ 已 push {pushed} 个文件到 {repo_name}")
        return pushed

    def delete_repo(self, repo_name: str):
        """下线时删除 Repo（可选）"""
        r = requests.delete(
            f"{self.BASE}/repos/{self._owner}/{repo_name}",
            headers=self.headers,
        )
        if r.status_code == 204:
            print(f"🗑️  Repo {repo_name} 已删除")
        else:
            print(f"⚠️  删除 Repo 失败: {r.status_code}")

    def run(self, slug: str, site_dir: Path) -> str:
        """
        主入口：创建 Repo + Push 文件
        返回 repo_name
        """
        repo_name = f"site-{slug}"
        print(f"\n📦 GitHub: {repo_name}")
        self.create_repo(repo_name)
        self.push_files(repo_name, site_dir)
        return repo_name
