import { Layout } from "@/components/Layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import axios from "axios";
const Register = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
      // router.push("/");
    }
  }, [router, session, redirect]);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    console.log(name, email, password);

    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      const result = await signIn(`credentials`, {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create account">
      <form className="mx-auto max-w-screen-md">
        <h1 className="mb-4 text-xl">Create account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            className="w-full"
            type="text"
            {...register("name", {
              required: "Please enter name",
            })}
            id="name"
            autoFocus
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            className="w-full"
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                message: "Please enter a valid",
              },
            })}
            id="email"
            autoFocus
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-full"
            type="password"
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        {/* <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-full"
            type="password"
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("passwrod"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
            className="w-full"
            type="password"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type !== "validate" && (
              <div className="text-red-500">Password do not match</div>
            )}
        </div> */}
        <div className="mb-4">
          <button
            onClick={handleSubmit(submitHandler)}
            className="primary-button"
          >
            Register
          </button>
        </div>
        <div className="mb-4">
          Already have an account? &nbsp;
          <Link href={`/login?redirect=${redirect || "/"}`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
};

export default Register;
