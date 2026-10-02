import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { company } from "../../data/siteData";
import usePublicContent from "../../hooks/usePublicContent";
import { publicContentApi } from "../../Api/CmsApi";
import styles from "./Contact.module.css";
import api from "../../Api/ApiIntersceptor";

const initial = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  contactMethod: "Email",
  message: "",
  consent: false,
};

export default function Contact() {
  const { items: managedServices } = usePublicContent("services");
  const serviceOptions = managedServices.map((service) => service.title);
  const [managedCompany, setManagedCompany] = useState(null);
  const companyInfo = { ...company, ...managedCompany };

  useEffect(() => {
    publicContentApi.company().then(setManagedCompany).catch(() => {});
  }, []);

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const update = (e) => {

    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((e2) => ({
      ...e2,
      [name]: "",
    }));

  };

  const validate = () => {
    const e = {};

    if (form.name.trim().length < 2) {
      e.name = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (
      form.phone &&
      !/^[0-9+()\-\s]{7,30}$/.test(form.phone.trim())
    ) {
      e.phone = "Please enter a valid phone number.";
    }

    if (!form.service) {
      e.service = "Please select a service.";
    }

    if (form.message.trim().length < 20) {
      e.message = "Please provide at least 20 characters.";
    }

    if (!form.consent) {
      e.consent = "Please accept the consent statement.";
    }

    return e;
  };


  const submit = async (e) => {

    e.preventDefault();
    const validation = validate();

    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    

    try {
      const response = await api.post('/v1/inquiry/register',form)
      console.log("response = ",response)
      alert('Inquiry submited successfully...')
      setForm(initial);
      setErrors({});
    
    } 
    catch (error) {
      console.log('failed to submit enquiery = ',error.response.data)
      alert(error.response.data.message)
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.ctaSection} id="contact">
      <div className={styles.container}>
        <div className={styles.contactGrid}>
          {/* CONTACT INFORMATION */}
          <div className={styles.contactCopy}>
            <p className={styles.eyebrow}>LET&apos;S TALK</p>

            <h2>
              Ready to build a{" "}
              <em>smarter path forward?</em>
            </h2>

            <p>
              Tell us what you're working through. We'll listen,
              ask the right questions, and help you identify the
              most useful next step.
            </p>

            <div className={styles.contactDetails}>
              <a href={`mailto:${companyInfo.email}`}>
                <Mail size={18} />
                <span>{companyInfo.email}</span>
              </a>

              <a
                href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
              >
                <Phone size={18} />
                <span>{companyInfo.phone}</span>
              </a>

              <span>
                <MapPin size={18} />
                <span>{companyInfo.location}</span>
              </span>
            </div>

            <small>
              Business hours: {companyInfo.hours}
            </small>
          </div>


          {/* FORM */}
          <form
            className={styles.contactForm}
            onSubmit={submit}
            noValidate
          >
            <div className={styles.formHeader}>
              <h3>Start a conversation</h3>
              <p>
                Tell us a little about what you need.
              </p>
            </div>

           
            {/* NAME + EMAIL */}
            <div className={styles.formRow}>
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={update}
                error={errors.name}
                required
                autoComplete="name"
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                error={errors.email}
                required
                autoComplete="email"
              />
            </div>

            {/* PHONE + COMPANY */}
            <div className={styles.formRow}>
              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={update}
                error={errors.phone}
                autoComplete="tel"
              />

              <Field
                label="Company"
                name="company"
                value={form.company}
                onChange={update}
                autoComplete="organization"
              />
            </div>

            {/* SERVICE + Contact method */}
            <div className={styles.formRow}>
              <SelectField
                label="Service Required"
                name="service"
                value={form.service}
                onChange={update}
                error={errors.service}
                required
                options={[
                  "Select a service",
                  ...serviceOptions,
                  "Other",
                ]}
              />

              <SelectField
              label="Preferred Contact Method"
              name="contactMethod"
              value={form.contactMethod}
              onChange={update}
              options={[
                "Email",
                "Phone",
                "WhatsApp",
                "Video call",
              ]}
            />
            </div>

           

            {/* MESSAGE */}
            <div className={styles.field}>
              <label htmlFor="message">
                Tell us about your needs <span>*</span>
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                minLength="20"
                maxLength="2000"
                value={form.message}
                onChange={update}
                placeholder="What are you trying to achieve, and what challenge are you facing?"
                aria-invalid={!!errors.message}
              />

              <div className={styles.fieldMeta}>
                <small className={styles.fieldError}>
                  {errors.message}
                </small>

                <small>
                  {form.message.length}/2000
                </small>
              </div>
            </div>

            {/* CONSENT */}
            <label className={styles.consent}>
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={update}
              />

              <span>
                I agree to the Privacy Policy and consent to
                being contacted regarding my inquiry.
              </span>
            </label>

            <small className={styles.fieldError}>
              {errors.consent}
            </small>

            {/* SUBMIT */}
            <button
              className={styles.submitBtn}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className={styles.buttonLoader} />
              ) : (
                "Send Inquiry"
              )}
            </button>

            

            <p className={styles.formNote}>
              Never put private API keys, SMTP passwords, or
              database credentials in frontend React code.
            </p>

          </form>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FIELD COMPONENT
   ========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  ...props
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>
        {label} {required && <span>*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={160}
        aria-invalid={!!error}
        {...props}
      />

      <small className={styles.fieldError}>
        {error}
      </small>
    </div>
  );
}

/* =========================================================
   SELECT COMPONENT
   ========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>
        {label} {required && <span>*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
      >
        {options.map((o, i) => (
          <option
            value={
              i === 0 &&
              options[0].toLowerCase().startsWith("select")
                ? ""
                : o
            }
            key={o}
          >
            {o}
          </option>
        ))}
      </select>

      <small className={styles.fieldError}>
        {error}
      </small>
    </div>
  );
}



