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
      className="card-contrast shadow-sm transition hover:shadow-md text-center"
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
              listType="picture-card"
              className="rounded-2xl border-white/10 bg-slate-900/40 !flex !flex-col !items-center !justify-center !py-0 overflow-hidden" 
              showUploadList={false}
            >
              <div className="flex w-full h-full flex-col items-center justify-center gap-1 text-white/90">
                <PlusOutlined style={{ fontSize: '1.5rem' }} />
                <div className="text-sm font-semibold text-center">Upload</div>
              </div>
            </Upload>
            
            <p className="rounded-xl text-center">Arraste o arquivo ou clique para selecionar</p>
            {file && (
              <p className="mt-1 text-xs text-white/70 text-center">
                {file.name}
              </p>
            )}
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