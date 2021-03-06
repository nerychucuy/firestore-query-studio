import React, { useState, useEffect } from "react";
import "./Collection.css";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Save from "@material-ui/icons/Save";
import firebase from "../../Firebase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FolderOpen from "@material-ui/icons/FolderOpen";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";

const firestore = firebase.firestore();

type CollectionProps = {
  selectedCollection: string | undefined;
  onSelectCollection: (collection: string) => void;
};

export default function Collection(props: CollectionProps) {
  const [newCollection, setNewCollection] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);
  const [collections, setCollections] = useState<string[] | undefined>([]);

  useEffect(() => {
    const local_collections = localStorage.getItem("collections")?.split(",");
    setCollections(local_collections);
  }, []);

  const addCollection = async () => {
    if (newCollection?.length === 0) {
      setInputError(true);
      return;
    }
    setInputError(false);

    let local_collections = localStorage.getItem("collections")?.split(",");

    if (local_collections?.includes(newCollection)) {
      alert("Collection already added");
      return;
    }

    //Validate if collection exists by retrieving 1 record from that collection
    const data = await firestore.collection(newCollection).limit(1).get();
    if (data.empty) {
      alert("Collection does not exist or does not have any documents.");
      return;
    }

    if (!local_collections) {
      local_collections = [];
    }

    local_collections.push(newCollection);
    localStorage.setItem("collections", local_collections.join(","));
    setCollections(local_collections);
    setNewCollection("");
  };

  const deleteCollection = (collection: string) => {
    let local_collections = localStorage.getItem("collections")?.split(",");
    let new_collections: string[] = [];
    local_collections?.forEach((col) =>
      col !== collection ? new_collections.push(col) : null
    );
    if (new_collections.length === 0) {
      localStorage.removeItem("collections");
    } else {
      localStorage.setItem("collections", new_collections.join(","));
    }
    setCollections(new_collections);
  };

  return (
    <div className="collections">
      <h1>Collections</h1>
      <section>
        <form autoComplete="off">
          <TextField
            id="standard-basic"
            label="Collection name"
            value={newCollection}
            error={inputError}
            helperText={inputError ? "Please, enter collection name" : null}
            onChange={({ target: { value } }) => setNewCollection(value)}
          />
          <IconButton
            color="primary"
            aria-label="colection name"
            component="span"
            onClick={addCollection}
          >
            <Save />
          </IconButton>
        </form>
      </section>
      {collections && collections.length > 0 && (
        <section>
          <List component="nav" aria-label="main mailbox folders">
            {collections.map((collection) => {
              return (
                <ListItem
                  button
                  key={collection}
                  selected={
                    props.selectedCollection
                      ? collection === props.selectedCollection
                      : false
                  }
                  onClick={() => props.onSelectCollection(collection)}
                >
                  <ListItemIcon>
                    <FolderOpen />
                  </ListItemIcon>
                  <ListItemText primary={collection} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteCollection(collection)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </section>
      )}
    </div>
  );
}
