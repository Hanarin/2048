import styles from "./Block.module.css";

const Block = ({ key, value }) => {
  const colorMap = {
    0: { background: "#BDC3C7" },
    2: { background: "#FFFFFF", color: "#111" },
    4: { background: "#D0EAF8", color: "#111" },
    8: { background: "#A8D4EF", color: "#111" },
    16: { background: "#7BBEE4", color: "#154360" },
    32: { background: "#4EA8D8", color: "#fff" },
    64: { background: "#2E8DC0", color: "#fff" },
    128: { background: "#1A6FA0", color: "#fff" },
    256: { background: "#155480", color: "#fff" },
    512: { background: "#5BC4C4", color: "#fff" },
    1024: { background: "#29A9A9", color: "#fff" },
    2048: { background: "#F5C842", color: "#7D6608" },
  };

  const style = {
    "--bg": colorMap[value]?.background ?? "#E6A817",
    "--color": colorMap[value]?.color ?? "#333",
  };

  return (
    <div className={styles.block} style={style}>
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Block;
