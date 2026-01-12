import { PlusOutlined } from "@ant-design/icons"
import { Button, Card, Form, Select, Typography, Upload, message } from "antd"
import { useMemo, useState, type ComponentProps } from "react"

import { useCsvUpload } from "../../hooks/useCsvUpload"

const entities = [
  { value: "categories", label: "Categorias" },
  { value: "products", label: "Produtos" },
  { value: "sales", label: "Vendas" },
]

const { Text } = Typography

const CsvIngestForm = () => {
  const mutation = useCsvUpload()
  const [entity, setEntity] = useState("products")
  const [file, setFile] = useState<File>()

  const handleDrop = (selectedFile: File) => {
    setFile(selectedFile)
    return false
  }

  const handleSubmit = async () => {
    if (!file) {
      message.warning("Selecione um arquivo antes de enviar.")
      return
    }
    await mutation.mutateAsync({ entity, file })
    setFile(undefined)
  }

  type Feedback = { type: ComponentProps<typeof Text>["type"]; text: string | undefined } | null

  const feedback = useMemo<Feedback>(() => {
    if (mutation.status === "success") return { type: "success", text: mutation.data?.insight }
    if (mutation.status === "error") return { type: "warning", text: "Falha no upload. Refaça o envio." }
    return null
  }, [mutation.data?.insight, mutation.status])

  const isUploading = mutation.status === "pending"

  return (
    <Card
      className="card-contrast shadow-sm transition hover:shadow-md"
      size="small"
      title="Upload CSV"
      headStyle={{ padding: "0.5rem 0" }}
      bodyStyle={{ padding: "1rem" }}
    >
      <Form layout="vertical" requiredMark={false} className="space-y-4">
        <Form.Item label="Entidade">
          <Select
            value={entity}
            onChange={setEntity}
            options={entities}
            className="rounded-xl"
          />
        </Form.Item>
        
        <Form.Item label="Arquivo">
          <div className="flex flex-col items-center w-full">
            <Upload
              beforeUpload={handleDrop}
              accept=".csv"
              maxCount={1}
              fileList={file ? ([file] as any) : []}
              onRemove={() => setFile(undefined)}
              listType="text"
              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-slate-300"
              showUploadList={false}
            >
              <div className="flex w-full flex-col items-center justify-center gap-2 py-10 text-slate-500">
                <PlusOutlined style={{ fontSize: 24 }} />
                <div className="text-sm font-semibold text-slate-600 text-center">Selecionar ou arrastar</div>
                {file && (
                  <p className="text-xs text-slate-500/80 text-center">{file.name}</p>
                )}
              </div>
            </Upload>
            <p className="mt-2 text-sm text-slate-500 text-center">Envie um CSV para atualizar os dados corporativos</p>
          </div>
        </Form.Item>

        <Form.Item className="m-0">
          <Button
            type="primary"
            block
            loading={isUploading}
            onClick={handleSubmit}
            disabled={!file}
          >
            {isUploading ? "Processando..." : "Enviar CSV"}
          </Button>
        </Form.Item>
        {feedback && <Text type={feedback.type}>{feedback.text}</Text>}
      </Form>
    </Card>
  )
}

export default CsvIngestForm