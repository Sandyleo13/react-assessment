// src/components/AddRowForm.tsx
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addRow } from "../store/tableSlice";
import type { PersonRow } from "../types/RowTypes";
import { v4 as uuidv4 } from "uuid";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
};

export default function AddRowForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const dispatch = useDispatch();

  function onSubmit(data: FormValues) {
    const newRow: PersonRow = {
      id: uuidv4(),
      ...data
    };
    dispatch(addRow(newRow));
    reset();
    alert("Row added!");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ minWidth: 160 }}>
          <input {...register("firstName", { required: "First name required" })} placeholder="First name" />
          <div style={{ color: "red", fontSize: 12 }}>{errors.firstName?.message}</div>
        </div>
        <div style={{ minWidth: 160 }}>
          <input {...register("lastName", { required: "Last name required" })} placeholder="Last name" />
          <div style={{ color: "red", fontSize: 12 }}>{errors.lastName?.message}</div>
        </div>
        <div style={{ minWidth: 220 }}>
          <input {...register("email", {
            required: "Email required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
          })} placeholder="Email" />
          <div style={{ color: "red", fontSize: 12 }}>{errors.email?.message}</div>
        </div>
        <div style={{ minWidth: 160 }}>
          <input {...register("phone", {
            required: "Phone required",
            minLength: { value: 7, message: "Too short" }
          })} placeholder="Phone" />
          <div style={{ color: "red", fontSize: 12 }}>{errors.phone?.message}</div>
        </div>
        <div style={{ minWidth: 140 }}>
          <input {...register("city")} placeholder="City" />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit">Add Row</button>
      </div>
    </form>
  );
}
