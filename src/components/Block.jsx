import styles from "./Block.module.css";

const Block = ({ key, value, row, col, isNew, merged, toRemove }) => {
  const colorMap = {
    2: { background: "#FFFFFF", color: "#111" },
    4: { background: "#D0EAF8", color: "#111" },
    8: { background: "#A8D4EF", color: "#111" },
    16: { background: "#7BBEE4", color: "#154360" },
    32: { background: "#4EA8D8", color: "#fff" },
    64: { background: "#2E8DC0", color: "#fff" },
    128: { background: "#1A6FA0", color: "#fff" },
    256: { background: "#8ED8D8", color: "#fff" },
    512: { background: "#5BC4C4", color: "#fff" },
    1024: { background: "#29A9A9", color: "#fff" },
    2048: { background: "#F5C842", color: "#7D6608" },
  };

  const wrapperStyle = {
    "--cell-size": "94px",
    "--gap": "8px",
    "--row": row,
    "--col": col,
    opacity: toRemove ? 0 : 1,
  };

  const innerStyle = {
    "--bg": colorMap[value]?.background ?? "#E6A817",
    "--color": colorMap[value]?.color ?? "#333",
  };

  return (
    <div className={styles.blockWrapper} style={wrapperStyle}>
      <div
        className={[
          styles.blockInner,
          isNew && styles.appear,
          merged && styles.merge,
        ]
          .filter(Boolean)
          .join(" ")}
        style={innerStyle}
      >
        {value !== 0 ? value : ""}
      </div>
    </div>
  );
};

export default Block;
