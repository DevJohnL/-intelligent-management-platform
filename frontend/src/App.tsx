import { Button, Divider, Layout, Typography } from "antd"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { useState } from "react"

import DashboardOverview from "./features/dashboard/DashboardOverview"
import CsvIngestForm from "./features/forms/CsvIngestForm"
import ProductForm from "./features/forms/ProductForm"
import SaleForm from "./features/forms/SaleForm"

const { Sider, Content } = Layout
const { Title, Text } = Typography

const sampleFiles = [
  { label: "Categorias (modelo)", path: "examples/categories.csv" },
  { label: "Produtos (modelo)", path: "examples/products.csv" },
  { label: "Vendas (modelo)", path: "examples/sales.csv" },
]

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const layoutClassName = "min-h-screen bg-slate-50 text-slate-900"
  const siderClassName = "sider-theme border-r border-slate-200 text-slate-900"
  const baseUrl = import.meta.env.BASE_URL ?? "/"

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

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/90 px-4 py-3 text-left text-slate-600">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
                Modelos CSV
              </p>
              <div className="mt-2 flex flex-col gap-1 text-sm">
                {sampleFiles.map((sample) => (
                  <a
                    key={sample.path}
                    href={`${baseUrl}${sample.path}`}
                    download
                    className="text-slate-600 underline decoration-slate-200 underline-offset-4 transition hover:text-slate-900"
                  >
                    {sample.label}
                  </a>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Faça o download dos modelos e preencha os dados conforme sua necessidade seguindo sempre o exemplo.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Obs: recarregue a página sempre que fizer atualizações para garantir que os dados exibidos estejam sincronizados.
              <br />
              <br />
              Siga a ordem de importação de entidade: categorias, produtos e vendas.
              <br />
              <br />
              Adicione apenas um arquivo por vez.
            </p>
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

