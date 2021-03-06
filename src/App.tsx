import { useState } from "react";
import "./App.css";
import Collection from "./components/Collection/Collection";
import Documents from "./components/Documents/Documents";

function App() {
  const [collection, setCollection] = useState<string | undefined>(undefined);

  return (
    <div className="App">
      <Collection
        selectedCollection={collection}
        onSelectCollection={(collection: string) => {
          setCollection(collection);
        }}
      />
      {collection && <Documents key={collection} collection={collection} />}
    </div>
  );
}

export default App;
