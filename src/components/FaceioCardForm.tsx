"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import faceIO from "@faceio/fiojs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
type Props = {};

const FaceioCardForm: React.FC<Props> = ({}) => {
  const faceioRef = useRef<faceIO | null>(null);
  const [email, setEmail] = useState("");
  const [userLogin, setUserLogin] = useState("");

  // GET YOUR PUBLIC_ID VISIT https://faceio.net/getting-started 

  //   MUST SURE TO ADD YOU NEXT_PUBLIC_FACEIO_PUBLIC_ID IN .env FILE 
  const publicKey = process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID as string


  const initialiseFaceio = async () => {
    try {
      faceioRef.current = new faceIO(publicKey);
      console.log("FaceIO initialized successfully");
    } catch (error) {
      console.log(error);
	  handleError(error)
    }
  };
  useEffect(() => {
    initialiseFaceio();
   
  }, []);


// HANDLE REGISTER 
  const handleRegister = async () => {
    try {
      if (!faceioRef.current) {
        console.error("FaceIO instance is not initialized");
        return;
      }

       await faceioRef.current?.enroll({
        userConsent: false,
        locale: "auto",
        payload: { email: `${email}` },
      });
	  	// here you add you cookie storing logic ...
	  toast.success("Successfully Registered user.")
    } catch (error) {
      handleError(error);
      faceioRef.current?.restartSession();
    }
  };

// HANDLE LOGIN 
  const handleLogin = async () => {
    try {
      const authenticate = await faceioRef.current?.authenticate();
      console.log("User authenticated successfully:", authenticate);
      setUserLogin(authenticate.payload.email);
	  	  	// here you add you cookie storing logic ...

    } catch (error) {
      console.log(error);

      handleError(error);
    }
  };

  // HANDLing ERRORs 
  function handleError(errCode: any) {
    const fioErrs = faceioRef.current?.fetchAllErrorCodes()!;
    switch (errCode) {
      case fioErrs.PERMISSION_REFUSED:
        toast.info("Access to the Camera stream was denied by the end user");
        break;
      case fioErrs.NO_FACES_DETECTED:
        toast.info(
          "No faces were detected during the enroll or authentication process"
        );
        break;
      case fioErrs.UNRECOGNIZED_FACE:
        toast.info("Unrecognized face on this application's Facial Index");
        break;
      case fioErrs.MANY_FACES:
        toast.info("Two or more faces were detected during the scan process");
        break;
      case fioErrs.FACE_DUPLICATION:
        toast.info(
          "User enrolled previously (facial features already recorded). Cannot enroll again!"
        );
        break;
      case fioErrs.MINORS_NOT_ALLOWED:
        toast.info("Minors are not allowed to enroll on this application!");
        break;
      case fioErrs.PAD_ATTACK:
        toast.info(
          "Presentation (Spoof) Attack (PAD) detected during the scan process"
        );
        break;
      case fioErrs.FACE_MISMATCH:
        toast.info(
          "Calculated Facial Vectors of the user being enrolled do not matches"
        );
        break;
      case fioErrs.WRONG_PIN_CODE:
        toast.info("Wrong PIN code supplied by the user being authenticated");
        break;
      case fioErrs.PROCESSING_ERR:
        toast.info("Server side error");
        break;
      case fioErrs.UNAUTHORIZED:
        toast.info(
          "Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information"
        );
        break;
      case fioErrs.TERMS_NOT_ACCEPTED:
        toast.info(
          "Terms & Conditions set out by FACEIO/host application rejected by the end user"
        );
        break;
      case fioErrs.UI_NOT_READY:
        toast.info(
          "The FACEIO Widget could not be (or is being) injected onto the client DOM"
        );
        break;
      case fioErrs.SESSION_EXPIRED:
        toast.info(
          "Client session expired. The first promise was already fulfilled but the host application failed to act accordingly"
        );
        break;
      case fioErrs.TIMEOUT:
        toast.info(
          "Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)"
        );
        break;
      case fioErrs.TOO_MANY_REQUESTS:
        toast.info(
          "Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications"
        );
        break;
      case fioErrs.EMPTY_ORIGIN:
        toast.info("Origin or Referer HTTP request header is empty or missing");
        break;
      case fioErrs.FORBIDDDEN_ORIGIN:
        toast.info("Domain origin is forbidden from instantiating fio.js");
        break;
      case fioErrs.FORBIDDDEN_COUNTRY:
        toast.info(
          "Country ISO-3166-1 Code is forbidden from instantiating fio.js"
        );
        break;
      case fioErrs.SESSION_IN_PROGRESS:
        toast.info(
          "Another authentication or enrollment session is in progress"
        );
        break;
      case fioErrs.NETWORK_IO:
      default:
        toast.info(
          "Error while establishing network connection with the target FACEIO processing node"
        );
        break;
    }
  }


  return (
    <>
      <Card className="w-[400px] ">
        <CardHeader>
          <CardTitle> FaceIO Authentication Demo</CardTitle>
          <CardDescription>
            Enter your email for testing purpose
          </CardDescription>
        </CardHeader>
        <CardContent>
          
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="name"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleRegister}
                disabled={!email.includes("@gmail")}
              >
                Register new user
              </Button>
			  <p className="text-center w-full text-base">or</p>
			  <Button className="w-full" onClick={handleLogin} variant={'outline'}>
                  Log-in User
                </Button>
            </div>
        
        </CardContent>
        <CardFooter className="flex flex-col ">
          <p className="w-full mt-3 text-center text-xs ">
            Check out {""}
            <Link
              href="https://faceio.net/integration-guide"
              className="text-primary underline"
            >
             official Documentation
            </Link>
          </p>
        </CardFooter>
      </Card>

      {userLogin && (
        <Alert className="mt-3 w-fit">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Authenticated</AlertTitle>
          <AlertDescription>
            Authenticated user email: {userLogin}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
export default FaceioCardForm;
