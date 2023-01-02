import axios from "axios"
// import { useMutation } from "react-query"

const useChat = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-api.ringover-crm.xyz/",
    headers: {
      "Content-Type": "application/json",
    },
  })

  // "Content-Type": "multipart/form-data",

  const uploadMultimediaApi = async (formData) => {
    for (let key of formData.entries()) {
      console.log(key[0])
      console.log(key[1])
    }

    // var object = {}
    // for (let key of formData.entries()) {
    //   object[key[0]] = key[1]
    // }
    // var json = JSON.stringify(object)

    return axios
      .patch(`https://et-api.ringover-crm.xyz/v1/ticket/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res.data
      })
  }

  // const { isLoading: isMultimediaUploading, mutate: uploadMultimedia } = useMutation(uploadMultimediaApi)

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
    uploadMultimediaApi,
    getChatBotConfigData,
  }
}

export default useChat
