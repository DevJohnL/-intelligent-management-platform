import { Button, Card, Form, Input, InputNumber, Select, Typography } from "antd"
import { useMemo } from "react"

import { useCategories } from "../../hooks/useCategories"
import { useCreateProduct } from "../../hooks/useCreateProduct"
import { formatCurrencyInput, parseCurrencyInput } from "../../utils/currencyInput"

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
      className="card-contrast shadow-sm transition hover:shadow-md text-center"
      size="small"
      title="Cadastrar produto"
      headStyle={{ padding: "0.5rem 0" }}
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
          <InputNumber<number>
            min={0}
            step={0.01}
            size="large"
            className="w-full"
            formatter={formatCurrencyInput}
            parser={parseCurrencyInput}
          />
          </Form.Item>
          <Form.Item
            name="cost_price"
            label="Custo"
            rules={[{ required: true, message: "Informe o custo" }]}
            className="m-0"
          >
          <InputNumber<number>
            min={0}
            step={0.01}
            size="large"
            className="w-full"
            formatter={formatCurrencyInput}
            parser={parseCurrencyInput}
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
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            Salvar produto
          </Button>
        </Form.Item>
        {footerText && <Text type={mutation.isSuccess ? "success" : "warning"}>{footerText}</Text>}
      </Form>
    </Card>
  )
}

export default ProductForm

