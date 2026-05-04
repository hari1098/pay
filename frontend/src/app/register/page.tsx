import RegisterForm from "@/components/forms/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="mx-auto container max-w-3xl">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">
            Fill in your details to create a new account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
