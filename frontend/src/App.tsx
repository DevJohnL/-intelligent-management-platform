import { Button, Divider, Layout, Typography } from "antd"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { useState } from "react"

import DashboardOverview from "./features/dashboard/DashboardOverview"
import CsvIngestForm from "./features/forms/CsvIngestForm"
import ProductForm from "./features/forms/ProductForm"
import SaleForm from "./features/forms/SaleForm"

const { Sider, Content } = Layout
const { Title, Text } = Typography

const App = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className="min-h-screen bg-slate-950 text-white">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={320}
        collapsedWidth={92}
        trigger={null}
        className="bg-white shadow-2xl border-r border-white/10 text-slate-800"
        style={collapsed ? { width: 0, minWidth: 0, display: "none" } : undefined}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <div>
              <Title level={5} className="mb-0 text-white">
                SmartMart Analytics
              </Title>
              <Text className="text-slate-400">Operações rápidas</Text>
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-white"
          />
        </div>

        <Divider className="border-white/10" />

        {!collapsed && (
          <div className="space-y-6 px-4">
            <Title level={6} className="text-slate-400">
              Operações
            </Title>
            <ProductForm />
            <SaleForm />
            <CsvIngestForm />
          </div>
        )}

      </Sider>

      {collapsed && (
        <div className="fixed left-4 top-4 z-50">
          <Button
            type="text"
            shape="circle"
            icon={<MenuUnfoldOutlined className="text-white" />}
            onClick={() => setCollapsed(false)}
            className="bg-slate-50/80 text-slate-900 hover:bg-white border border-white/40"
          />
        </div>
      )}

      <Layout>
        <Content className="px-4 py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.8em] text-slate-500">
                SmartMart Analytics
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">Painel executivo de varejo</h1>

            </header>
            <Divider className="border-white/10" />
            <DashboardOverview />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

