'use client'

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from "./components/Layout";
import { NotificationService } from "../utils/notifications";

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'already_logged_in') {
      NotificationService.showInfo('Info', 'You are already logged in.').then(() => {
        router.replace('/')
      })
    }
  }, [searchParams, router])

  return (
    <>
      Hello World
    </>
  );
}
