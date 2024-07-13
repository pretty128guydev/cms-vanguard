"use client";
import React, { useEffect } from "react";
import { openDB } from 'idb';

const createDocument = async () => {
  const formData = { request: "1", type: "test" };

  try {
    const response = await fetch("/api/createDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formData }),
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error creating document:", error);
  }
};

const queuePostRequest = async (data) => {
  const db = await openDB('post-requests', 1, {
    upgrade(db) {
      db.createObjectStore('requests', { autoIncrement: true });
    }
  });

  await db.put('requests', data);
};

const handleCreateDocument = async () => {
  const formData = { request: "1", type: "test" };

  if (navigator.onLine) {
    await createDocument(formData);
  } else {
    await queuePostRequest(formData);
  }
};

export default function Page() {
  useEffect(() => {
    handleCreateDocument();
  }, []);

  return <div>page</div>;
}
