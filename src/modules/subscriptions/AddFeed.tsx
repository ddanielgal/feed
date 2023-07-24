import { FC, useState } from "react";
import { trpc } from "../trpc";

const AddFeed: FC = () => {
  const [url, setUrl] = useState("");
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.subscriptions.add.useMutation({
    onSuccess: () => {
      setUrl("");
    },
    onSettled: () => {
      utils.subscriptions.list.invalidate();
    },
  });
  return (
    <>
      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />
      <button disabled={isLoading} onClick={() => mutate({ url })}>
        Add feed
      </button>
    </>
  );
};

export default AddFeed;
