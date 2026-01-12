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
  const layoutClassName = "min-h-screen bg-slate-50 text-slate-900"
  const siderClassName = "sider-theme border-r border-slate-200 text-slate-900"

  return (
    <Layout className={layoutClassName}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={320}
        collapsedWidth={92}
        trigger={null}
        className={siderClassName}
        style={collapsed ? { width: 0, minWidth: 0, display: "none" } : undefined}
      >
        <div className="flex items-center justify-between px-6 py-5">
          {!collapsed && (
            <div>
              <Title level={5} className="mb-0 text-slate-800 tracking-wide">
                SmartMart Analytics
              </Title>
              <Text className="text-slate-500 uppercase text-xs tracking-[0.4em]">
                Operações
              </Text>
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-slate-900 hover:text-slate-700"
          />
        </div>

        <Divider className="divider-theme" />

        {!collapsed && (
          <div className="space-y-6 px-4 pb-6">
            <Title level={5} className="text-slate-700 tracking-[0.35em] uppercase text-xs">
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
            icon={<MenuUnfoldOutlined className="text-slate-900" />}
            onClick={() => setCollapsed(false)}
            className="bg-slate-200/80 text-slate-900 border border-slate-300 hover:bg-slate-100"
          />
        </div>
      )}

      <Layout>
        <Content className="px-4 py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <header className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 px-8 py-6 shadow-sm text-slate-900">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500">SmartMart Analytics</p>
                <h1 className="text-3xl font-semibold sm:text-4xl text-slate-900">Painel executivo de varejo</h1>
              </div>
              <Text className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Centralize indicadores operacionais e monitore o desempenho com clareza para orientar decisões estratégicas.
              </Text>
            </header>
            <Divider className="divider-theme" />
            <DashboardOverview />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

