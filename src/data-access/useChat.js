import axios from "axios"
// import { useMutation } from "react-query"

const useChat = () => {
  const PublicApi = axios.create({
    baseURL: "https://et-dev-api.ringover-crm.xyz/",
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
      .patch(`https://et-staging-api.ringover-crm.xyz/v1/ticket/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res.data
      })
  }

  // const { isLoading: isMultimediaUploading, mutate: uploadMultimedia } = useMutation(uploadMultimediaApi)

  return {
    uploadMultimediaApi,
  }
}

export default useChat
