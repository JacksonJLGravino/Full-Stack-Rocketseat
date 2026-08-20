import { Header } from "./components/Header";
import styles from "./app.module.css";

export default function App() {
  function handleRestartGame() {
    alert("reiniciar o jogo");
  }

  return (
    <div className={styles.container}>
      <Header current={5} max={10} onRestart={handleRestartGame}></Header>
    </div>
  );
}
