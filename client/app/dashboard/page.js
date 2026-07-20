'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log('token is:', token)
        if(!token) {
            router.push('/login')
        }
    }, [])
    return <div>Dashboard</div>
  }