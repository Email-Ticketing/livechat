import axios from "axios"

const useChat = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-dev-api.ringover-crm.xyz/",
    headers: {
      "Content-type": "application/json",
    },
  })

  const uploadMultimediaApi = async (formData) => {
    for (let key of formData.entries()) {
      console.log(key[0])
      console.log(key[1])
    }
    return PublicApi.patch(`v1/ticket/upload`, formData).then((res) => {
      return res.data
    })
  }

  return {
    uploadMultimediaApi,
  }
}

export default useChat
