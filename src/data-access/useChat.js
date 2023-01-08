import axios from "axios"
import { useMutation } from "react-query"
const useChat = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-dev-api.ringover-crm.xyz/",
    headers: {
      "Content-Type": "application/json",
    },
  })
  // "Content-Type": "multipart/form-data",
  const uploadMultimediaApi = async (formData) => {
    return PublicApi.patch(`v1/ticket/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log("uploadRes", res)
      return res.data
    })
  }

  const { isLoading: isMultimediaUploading, mutate: uploadMultimedia } = useMutation(uploadMultimediaApi)

  const deleteAttachmentHandler = async ({ support_message_id, support_chat_id, chat_attachment_id }) => {
    return PublicApi.delete(`v1/ticket/deleteAttachment`, {
      data: {
        support_message_id,
        support_chat_id,
        chat_attachment_id,
      },
    }).then((res) => {
      console.log("uploadRes", res)
      return res.data
    })
  }
  const { isLoading: isDeletingAttachment, mutate: deleteAttachment } = useMutation(deleteAttachmentHandler)

  return {
    uploadMultimedia,
    isMultimediaUploading,
    deleteAttachment,
    isDeletingAttachment,
  }
}

export default useChat
