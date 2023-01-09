import axios from "axios"
import { useMutation } from "react-query"
const useChat = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-staging-api.ringover-crm.xyz/",
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

  //GET CHATBOT CONFIGS DATA

  const getChatBotConfigData = async (team_cdn_id) => {
    return PublicApi.get(`v1/chatbot/cdn/${team_cdn_id}`)
      .then((res) => {
        console.log("CHATBOT CONFIGS", res)
        return res
      })
      .catch((error) => {
        console.log("CHATBOT CONFIG GET ERROR", error)
        return error
      })
  }

  return {
    uploadMultimedia,
    isMultimediaUploading,
    deleteAttachment,
    isDeletingAttachment,
    getChatBotConfigData,
  }
}

export default useChat
