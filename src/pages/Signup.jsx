import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {


    const [form,setForm] = useState({email:"",password:"", name:""})
    const [loading ,setLoading] = useState(false)
     const [err,setErr] = useState("")
    const navigate = useNavigate()


    const onSubmit=async(e)=>{
     e.preventDefault()
      setErr(""); 
     setLoading(true)

     try{
    const res = await fetch("https://restaurant-backend-tawny.vercel.app/users/register",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
     credentials: "include", 
     body: JSON.stringify(form),

    })

    const data = await res.json()

     if (!res.ok) throw new Error(data?.message || "Register failed");

     navigate("/login")

     }catch (error) {
       setErr(error.message);
     }finally{
         setLoading(false)
     }

    }


  return (
    // التعديل هنا:
    // 1. تقليل العرض الأقصى الافتراضي إلى 'max-w-sm' ليناسب الشاشات الصغيرة.
    // 2. إعادة العرض إلى 'md:max-w-md' على الشاشات المتوسطة والكبيرة.
    // 3. إضافة 'px-4' لتوفير مسافة جانبية على شاشات الموبايل.
    <div className="max-w-sm md:max-w-md mx-auto py-10 mt-40 px-4"> 
      <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          // التعديل هنا:
          // تقليل الـ padding من 'p-2' إلى 'p-1.5' على الشاشات الصغيرة لجعل الحقل أصغر قليلاً.
          className="w-full border p-1.5 md:p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          // التعديل هنا:
          className="w-full border p-1.5 md:p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        />
        <input
          // التعديل هنا:
          className="w-full border p-1.5 md:p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
        />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded w-full hover:bg-orange-700 transition"
        >
          {loading ? "..." : "Create account"}
        </button>
      </form>
    </div>
  )
}

export default Signup