import stripHTML from "../../../../../../libs/utils/stripHtml"

const MessageContent = ({ msg }) => {
  const newText = msg.content.split("\n").map((str) => {
    console.log("STR",str);
  return(<p>{str || <br />}</p>)
})
  return newText
}

export default MessageContent
