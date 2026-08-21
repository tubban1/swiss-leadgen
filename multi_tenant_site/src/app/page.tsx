import React from 'react';
import { headers } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import AdminDashboard from './admin/dashboard/page';
import TenantPage from './site/[domain]/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootPage() {
  let hostname = '';
  try {
    const headerList = await headers();
    const rawHost = headerList.get('x-forwarded-host') || headerList.get('host') || '';
    hostname = rawHost.split(':')[0];
  } catch (e) {
    console.error('Headers read error:', e);
  }

  // 1. 提取子域名
  let subdomain = '';
  if (hostname.includes('.sites.tubban.com')) {
    subdomain = hostname.replace('.sites.tubban.com', '');
  } else if (hostname.includes('.tubban.com')) {
    subdomain = hostname.replace('.tubban.com', '');
  }

  // 2. 无子域名或访问 sites.tubban.com 主站：渲染 Admin Dashboard
  if (!subdomain || subdomain === 'sites' || subdomain === 'admin' || hostname === 'multitenantsite-lac.vercel.app') {
    return <AdminDashboard />;
  }

  // 3. 子域名请求：直接调用多行业动态风格渲染器
  return <TenantPage params={{ domain: subdomain }} />;
}
