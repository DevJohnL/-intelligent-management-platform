import { Button, Card, DatePicker, Form, InputNumber, Select, Typography } from "antd"
import dayjs from "dayjs"

import { useProducts } from "../../hooks/useProducts"
import { useCreateSale } from "../../hooks/useCreateSale"
import { formatCurrencyInput, parseCurrencyInput } from "../../utils/currencyInput"

const { Text } = Typography

type SaleFormValues = {
  product_id: number
  quantity: number
  total_price: number
  date: dayjs.ConfigType
}

const SaleForm = () => {
  const [form] = Form.useForm()
  const { data: products, isLoading: loadingProducts } = useProducts()
  const mutation = useCreateSale()

  const onFinish = async (values: SaleFormValues) => {
    await mutation.mutateAsync({
      product_id: Number(values.product_id),
      quantity: Number(values.quantity),
      total_price: Number(values.total_price),
      date: dayjs(values.date).format("YYYY-MM-DD"),
    })
    form.resetFields()
  }

  return (
    <Card
      className="card-contrast shadow-sm transition hover:shadow-md"
      size="small"
      title="Registrar venda"
      headStyle={{ padding: "0.5rem 0" }}
      bodyStyle={{ padding: "1rem" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item
          name="product_id"
          label="Produto"
          rules={[{ required: true, message: "Selecione o produto" }]}
        >
          <Select
            placeholder="Selecione"
            loading={loadingProducts}
            options={products?.map((product: { id: number; name: string }) => ({
              label: product.name,
              value: product.id,
            }))}
          />
        </Form.Item>

        <div className="grid gap-3 md:grid-cols-2">
          <Form.Item
            name="quantity"
            label="Quantidade"
            rules={[{ required: true, message: "Informe a quantidade" }]}
            className="m-0"
          >
            <InputNumber min={1} size="large" className="w-full" />
          </Form.Item>
          <Form.Item
            name="total_price"
            label="Total (BRL)"
            rules={[{ required: true, message: "Informe o valor total" }]}
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
          name="date"
          label="Data"
          rules={[{ required: true, message: "Informe a data da venda" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item className="m-0">
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            Adicionar venda
          </Button>
        </Form.Item>
        {mutation.isSuccess && <Text type="success">Venda registrada.</Text>}
        {mutation.isError && <Text type="warning">Não foi possível registrar.</Text>}
      </Form>
    </Card>
  )
}

export default SaleForm

