/*
 * Async bootstrap — required by Module Federation so shared React can be
 * negotiated with FatNotes before the plugin module is evaluated.
 */
import("./index");
export {};
