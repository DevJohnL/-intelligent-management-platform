import { Button, Card, Form, Input, InputNumber, Select, Typography } from "antd"
import { useMemo } from "react"

import { useCategories } from "../../hooks/useCategories"
import { useCreateProduct } from "../../hooks/useCreateProduct"

const { Text } = Typography

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

type ProductFormValues = {
  name: string
  price: number
  cost_price: number
  category_id: number
}

const ProductForm = () => {
  const [form] = Form.useForm()
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const mutation = useCreateProduct()

  const onFinish = async (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      price: Number(values.price),
      cost_price: Number(values.cost_price),
      category_id: Number(values.category_id),
    }
    await mutation.mutateAsync(payload)
    form.resetFields()
  }

  const footerText = useMemo(() => {
    if (mutation.isSuccess) return "Produto salvo com sucesso."
    if (mutation.isError) return "Falha ao salvar. Tente novamente."
    return null
  }, [mutation.isError, mutation.isSuccess])

  return (
    <Card
      className="bg-slate-900/60 border border-white/10 shadow-2xl !flex !flex-col !items-center !justify-center"
      size="small"
      title="Cadastrar produto"
      headStyle={{ padding: 0 }}
      bodyStyle={{ padding: "1rem" }}
    >
      <Form
        {...layout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: "Informe o nome do produto" }]}
        >
          <Input size="large" placeholder="Ex: Samsung 65” QLED" />
        </Form.Item>

        <div className="grid gap-3 md:grid-cols-2">
          <Form.Item
            name="price"
            label="Preço"
            rules={[{ required: true, message: "Informe o preço" }]}
            className="m-0"
          >
            <InputNumber
              min={0}
              step={0.01}
              size="large"
              className="w-full"
              formatter={(value) => (value ?? 0 ? `R$ ${value}` : "")}
              parser={(value) => Number(value?.replace(/[R$\s,]/g, ""))}
            />
          </Form.Item>
          <Form.Item
            name="cost_price"
            label="Custo"
            rules={[{ required: true, message: "Informe o custo" }]}
            className="m-0"
          >
            <InputNumber
              min={0}
              step={0.01}
              size="large"
              className="w-full"
              formatter={(value) => (value ?? 0 ? `R$ ${value}` : "")}
              parser={(value) => Number(value?.replace(/[R$\s,]/g, ""))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="category_id"
          label="Categoria"
          rules={[{ required: true, message: "Escolha uma categoria" }]}
        >
          <Select
            placeholder="Selecione"
            loading={loadingCategories}
            options={categories?.map((category: { id: number; name: string }) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>

        <Form.Item className="m-0">
          <Button type="primary" htmlType="submit" block loading={mutation.isLoading}>
            Salvar produto
          </Button>
        </Form.Item>
        {footerText && <Text type={mutation.isSuccess ? "success" : "warning"}>{footerText}</Text>}
      </Form>
    </Card>
  )
}

export default ProductForm

