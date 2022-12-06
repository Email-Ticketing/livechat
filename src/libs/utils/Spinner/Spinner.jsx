import styles from "./Spinner.module.scss"

function Spinner({ className }) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles["lds-ring"]} 
        ${className}`}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner
