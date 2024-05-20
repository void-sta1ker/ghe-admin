import { useNavigate } from "react-router-dom";
import { Result } from "antd";
import { Button } from "@mantine/core";

export default function Error(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <>
          <Button
            variant="light"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="light"
            onClick={() => {
              navigate("/");
            }}
          >
            Back Home
          </Button>
        </>
      }
    />
  );
}
