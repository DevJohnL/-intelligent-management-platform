import { useMutation } from "@tanstack/react-query"

import { uploadCsv } from "../services/api"

export const useCsvUpload = () =>
  useMutation({
    mutationFn: ({ entity, file }: { entity: string; file: File }) => uploadCsv(entity, file),
  })

