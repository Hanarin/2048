import styles from "./Block.module.css";

const Block = ({ key, value }) => {
  const colorMap = {
    0: { background: "#BDC3C7" },
    2: { background: "#FFFFFF", color: "#111" },
    4: { background: "#D0EAF8", color: "#111" },
    8: { background: "#A8D4EF", color: "#111" },
    16: { background: "#7BBEE4", color: "#154360" },
    32: { background: "#4EA8D8", color: "#fff" },
    // ...
  };

  const style = {
    "--bg": colorMap[value]?.background ?? "#BDC3C7",
    "--color": colorMap[value]?.color ?? "transparent",
  };

  return (
    <div className={styles.block} style={style}>
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Block;
