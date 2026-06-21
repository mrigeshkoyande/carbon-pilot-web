import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, sanitizeText } from "../firebase";

export const EmissionForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [category, setCategory] = useState<"Transport" | "Energy" | "Food" | "Waste">("Transport");
  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setFormError("Please enter a valid positive emission value.");
      return;
    }

    if (!userId) {
      setFormError("User session not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const logData = {
        userId,
        category,
        value: numericValue,
        impact: numericValue,
        activityType: category,
        date,
        notes: sanitizeText(notes.trim()),
        createdAt: serverTimestamp(), // Replaced Date string with robust Timestamp for sorting
      };

      await addDoc(collection(db, "emissions"), logData);

      setValue("");
      setNotes("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err: any) {
      console.error("Error adding doc:", err);
      setFormError(err.message || "Failed to save data to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="logger-card glass-card">
      <h3>Record New Carbon Log</h3>
      <p className="logger-subtitle">
        Saves a new telemetry data record securely into your Firestore database.
      </p>

      {formError && <div className="form-error" role="alert" aria-live="assertive">✕ {formError}</div>}

      <form onSubmit={handleAddLog} className="logger-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="category">Emission Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="Transport">Transport (Flights, Car, Fuel)</option>
              <option value="Energy">Energy (Electricity, Heat, AC)</option>
              <option value="Food">Food (Meat, Dairy, Processing)</option>
              <option value="Waste">Waste (Trash, Landfill, Recycle)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="value">CO₂ Footprint (kg)</label>
            <input
              type="number"
              id="value"
              placeholder="e.g. 45.2"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date of Activity</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes / Context</label>
            <input
              type="text"
              id="notes"
              placeholder="e.g., Daily commute, flight to JFK"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="logger-submit-btn btn-glow"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Recording Data..." : "Save Record"}
        </button>
      </form>
    </div>
  );
};
