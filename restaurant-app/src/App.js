import './App.css';
import { Typography} from "@material-ui/core";
import Order from "./components/Order";

function App() {
  return (
    <container maxWidth="md">
      <Typography gutterBottom variant ="h2" align = "center">
        Restaurant App
      </Typography>
      <Order />
    </container>
  );
}

export default App;
