import FaceBlurForm from "@/components/FaceBlurForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {};

const page: React.FC<Props> = ({}) => {
  return (
    <Card className="w-[800px] ">
      <CardHeader>
        <CardTitle> Detect and Blur Faces with PixLab Api Demo</CardTitle>
        <CardDescription>
          Upload your image with faced and click on genereate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FaceBlurForm />
      </CardContent>
      
    </Card>
  );
};
export default page;
