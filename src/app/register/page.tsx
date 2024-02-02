"use client";
import { registerSchema } from "@/schemas/register";
import { useFormik } from "formik";
import Link from "next/link";
import { act } from "react-dom/test-utils";

function Register() {
  const { values, handleSubmit, handleChange, isSubmitting, errors } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        pass: "",
        address: "",
        city: "",
      },
      validationSchema: registerSchema,
      onSubmit: async (values, action) => {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (data?.error) {
          alert(data.error);
        } else {
          alert(data.data);
          action.resetForm();
        }
      },
    });

  return (
    <div>
      <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <label htmlFor="name">Name:</label>
          <input
            className=""
            id="name"
            type="text"
            name="name"
            placeholder="enter name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="enter email"
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="pass">Password:</label>
          <input
            id="pass"
            type="password"
            name="pass"
            placeholder="enter password"
            value={values.pass}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="enter address"
            value={values.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            type="text"
            name="city"
            placeholder="enter city"
            value={values.city}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-min bg-white text-black p-2 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Register
        </button>
      </form>

      {isSubmitting && <p className="text-lg">Submitting...</p>}

      <p className="flex gap-2 mt-4">
        Already have an account?
        <Link href="/api/auth/signin">SignIn</Link>
      </p>
    </div>
  );
}

export default Register;
