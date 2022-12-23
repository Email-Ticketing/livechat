import { extract } from "letterparser"
import { Letter } from "react-letter"

const MessageContent = ({ msg }) => {
  var newText = msg?.content.replace(/\n/g, "<br />")

  const { html, text } = extract(`Content-Type: text/html; charset=utf-8

                                ${newText}`)

  return <Letter html={html} text={text} />
}

export default MessageContent
