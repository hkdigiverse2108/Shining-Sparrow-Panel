import * as Yup from "yup";
import type { FieldOptions, FieldSchemaArgs, FieldTypeMap, Primitive } from "@/Types";

export function Validation<K extends keyof FieldTypeMap>(...args: FieldSchemaArgs<K>): FieldTypeMap[K] {
  let type: K;
  let label: string;
  let options: FieldOptions<FieldTypeMap[K]> | undefined;

  if (typeof args[1] === "string") {
    [type, label, options] = args as [K, string, FieldOptions<FieldTypeMap[K]>?];
  } else {
    [type, options] = args as [K, FieldOptions<FieldTypeMap[K]>?];
    label = "Field";
  }

  const { required = true, extraRules, minItems } = options || {};
  let schema: FieldTypeMap[K];

  switch (type) {
    case "string":
      schema = Yup.string() as FieldTypeMap[K];
      // schema = required ? (schema.required(`${label} is required`) as FieldTypeMap[K]) : (schema.nullable().notRequired() as FieldTypeMap[K]);
      break;

    case "boolean":
      schema = Yup.boolean() as FieldTypeMap[K];
      // schema = required ? (schema.required(`${label} is required`) as FieldTypeMap[K]) : (schema.nullable().notRequired() as FieldTypeMap[K]);
      break;

    case "number":
      schema = Yup.number().typeError(`${label} must be a number`) as FieldTypeMap[K];
      // schema = required ? (schema.required(`${label} is required`) as FieldTypeMap[K]) : (schema.nullable().notRequired() as FieldTypeMap[K]);
      break;

    case "array":
      schema = Yup.array() as FieldTypeMap[K];
      if (minItems && minItems > 0) schema = (schema as Yup.ArraySchema<any[], Yup.AnyObject>).min(minItems, `${label} is required`) as FieldTypeMap[K];
      // schema = required ? (schema.required(`${label} is required`) as FieldTypeMap[K]) : (schema.notRequired() as FieldTypeMap[K]);
      break;

    default:
      throw new Error(`Unsupported field type: ${type}`);
  }

  schema = required ? (schema.required(`${label} is required`) as FieldTypeMap[K]) : (schema.notRequired() as FieldTypeMap[K]);

  return extraRules ? extraRules(schema) : schema;
}

export const RequiredWhen = (dependentField: string, requiredValues: Primitive[], label: string, type: "string" | "number" | "array" = "string", options?: { extraRules?: (schema: Yup.AnySchema) => Yup.AnySchema }) => {
  let schema: Yup.AnySchema;

  // Base schema by type
  if (type === "number") schema = Yup.number();
  else if (type === "array") schema = Yup.array();
  else schema = Yup.string();

  // Apply extra rules if provided
  if (options?.extraRules) schema = options.extraRules(schema);

  return schema.test("required-when", `${label} is required`, (value, { from }) => {
    const root = from?.[from.length - 1]?.value;
    const dependentValue = root?.[dependentField];
    const match = requiredValues.includes(dependentValue);

    if (match) {
      if (type === "array") return Array.isArray(value) && value.length > 0;
      if (type === "number") return value !== undefined && value !== null;
      return !!value;
    }

    return true;
  });
};

// ---------- Reusable helpers ----------

export const PhoneValidation = (label = "Phone No", options?: { requiredCountryCode?: boolean; requiredNumber?: boolean }) =>
  Yup.object({
    countryCode: Validation("string", "Country code", {
      required: options?.requiredCountryCode ?? true,
    }),

    number: Validation("string", label, {
      required: options?.requiredNumber ?? true,
      extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    }),
  });