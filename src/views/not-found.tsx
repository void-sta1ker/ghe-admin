import { useNavigate } from "react-router-dom";
import { Result } from "antd";
import { Button } from "@mantine/core";

export default function NotFound(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          variant="light"
          onClick={() => {
            navigate("/");
          }}
        >
          Back Home
        </Button>
      }
    />
  );
}
