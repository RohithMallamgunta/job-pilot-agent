
/**
 * JOB PILOT AGENT
 * Module 01 — Configuration Workbook
 *
 * Creates and validates the agent's Google Sheets
 * control center without deleting existing user data.
 */

const SCHEMA = {
  Settings: [
    "Setting", "Value", "Description"
  ],
  Job_Sources: [
    "Source ID", "Source Name", "Adapter",
    "Identifier / URL", "Enabled", "Notes"
  ],
  Job_Tracker: [
    "Job ID", "Discovered At", "Company",
    "Job Title", "Location", "Source ID",
    "Job URL", "Match Score", "Status",
    "Resume URL", "ATS Score", "Approval Mode",
    "Resume Version", "Submitted At",
    "Confirmation Ref", "Notes"
  ],
  ATS_Reports: [
    "Report ID", "Created At", "Job ID",
    "Resume URL", "Readiness Score",
    "Threshold", "Result", "Parsing Check",
    "Formatting Check", "Factuality Check",
    "Feedback"
  ],
  Activity_Log: [
    "Timestamp", "Level", "Component",
    "Action", "Reference ID", "Message"
  ]
};

const DEFAULT_SETTINGS = [
  ["report_time", "08:00", "Daily report time (HH:mm)"],
  ["timezone", "Asia/Kolkata", "IANA timezone"],
  ["target_roles", "", "Comma-separated job titles"],
  ["target_locations", "", "Comma-separated locations"],
  ["master_resume_url", "", "Google Drive resume link"],
  ["approval_mode", "MANUAL", "MANUAL or AUTO"],
  ["match_threshold", 70, "Minimum job-fit score (0–100)"],
  ["ats_threshold", 80, "Internal ATS-readiness threshold"],
  ["daily_application_limit", 5, "Maximum daily submissions"],
  ["automation_paused", true, "Safety pause"],
  ["applications_enabled", false, "Submission safety switch"]
];

const JOB_STATUSES = [
  "DISCOVERED",
  "SELECTED",
  "DRAFTING",
  "ATS_FAILED",
  "AWAITING_APPROVAL",
  "REVISION_REQUESTED",
  "APPROVED",
  "SUBMITTING",
  "SUBMITTED",
  "MANUAL_ACTION",
  "FAILED",
  "REJECTED"
];

// Adds a convenient menu when the spreadsheet opens.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Job Pilot Agent")
    .addItem("Setup / Repair Workbook", "setupWorkbook")
    .addItem("Run Setup Test", "runSetupTest")
    .addToUi();
}

// Main setup function.
function setupWorkbook() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  for (const [name, headers] of Object.entries(SCHEMA)) {
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      // Reuse the original blank tab if possible.
      const blank = ss.getSheets().find(s =>
        s.getLastRow() === 0 &&
        s.getLastColumn() === 0 &&
        !Object.keys(SCHEMA).includes(s.getName())
      );

      if (blank) {
        sheet = blank;
        sheet.setName(name);
      } else {
        sheet = ss.insertSheet(name);
      }
    }

    // Create headers only if the sheet is empty.
    // Never overwrite populated worksheets.
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length)
        .setValues([headers]);
    } else {
      const actual = sheet
        .getRange(1, 1, 1, headers.length)
        .getDisplayValues()[0];

      if (actual.join("|") !== headers.join("|")) {
        throw new Error(
          "Header mismatch in " + name +
          ". Existing data was preserved."
        );
      }
    }

    sheet.setFrozenRows(1);

    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#E9EEF5")
      .setFontColor("#172033");

    sheet.setColumnWidth(1, 175);
    sheet.setColumnWidth(2, 220);

    if (headers.length >= 3) {
      sheet.setColumnWidth(3, 260);
    }
  }

  configureSettings(ss.getSheetByName("Settings"));
  configureSources(ss.getSheetByName("Job_Sources"));
  configureTracker(ss.getSheetByName("Job_Tracker"));

  const log = ss.getSheetByName("Activity_Log");
  log.getRange("A2:A").setNumberFormat(
    "yyyy-mm-dd hh:mm:ss"
  );

  recordActivity(
    "INFO", "CONFIG",
    "WORKBOOK_SETUP", "",
    "Configuration workbook initialized"
  );

  ss.toast(
    "Configuration workbook ready!",
    "Job Pilot Agent",
    8
  );

  Logger.log("Workbook setup completed.");
}

// Adds missing defaults without overwriting user settings.
function configureSettings(sheet) {
  const existingRows = sheet.getLastRow() > 1
    ? sheet.getRange(
        2, 1, sheet.getLastRow() - 1, 1
      ).getValues().flat()
    : [];

  const existing = new Set(existingRows);

  const missing = DEFAULT_SETTINGS.filter(
    row => !existing.has(row[0])
  );

  if (missing.length) {
    sheet.getRange(
      sheet.getLastRow() + 1,
      1,
      missing.length,
      3
    ).setValues(missing);
  }

  sheet.setColumnWidth(1, 230);
  sheet.setColumnWidth(2, 270);
  sheet.setColumnWidth(3, 420);

  const settings = sheet.getRange(
    2, 1, sheet.getLastRow() - 1, 1
  ).getValues().flat();

  const rowOf = key => settings.indexOf(key) + 2;

  // Approval mode dropdown.
  sheet.getRange(rowOf("approval_mode"), 2)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(["MANUAL", "AUTO"], true)
        .setAllowInvalid(false)
        .build()
    );

  const checkboxRule = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  for (const key of [
    "automation_paused",
    "applications_enabled"
  ]) {
    sheet.getRange(rowOf(key), 2)
      .setDataValidation(checkboxRule);
  }

  sheet.getRange(rowOf("report_time"), 2)
    .setNumberFormat("@");
}

// Configures supported job-source types.
function configureSources(sheet) {
  const adapterRule = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(
      ["GREENHOUSE", "LEVER", "ASHBY", "CUSTOM_URL"],
      true
    )
    .setAllowInvalid(false)
    .build();

  sheet.getRange("C2:C500")
    .setDataValidation(adapterRule);

  sheet.getRange("E2:E500")
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireCheckbox()
        .build()
    );

  sheet.setColumnWidth(4, 360);
  sheet.setColumnWidth(6, 350);
}

// Configures future application states.
function configureTracker(sheet) {
  sheet.getRange("I2:I500")
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(JOB_STATUSES, true)
        .setAllowInvalid(false)
        .build()
    );

  sheet.setColumnWidth(4, 280);
  sheet.setColumnWidth(7, 360);
  sheet.setColumnWidth(10, 360);
}

// Centralized activity logging.
function recordActivity(
  level, component, action, referenceId, message
) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Activity_Log");

  sheet.appendRow([
    new Date(),
    level,
    component,
    action,
    referenceId,
    message
  ]);
}

// First automated structural test.
function runSetupTest() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const errors = [];

  for (const [name, expected] of Object.entries(SCHEMA)) {
    const sheet = ss.getSheetByName(name);

    if (!sheet) {
      errors.push("Missing sheet: " + name);
      continue;
    }

    const actual = sheet
      .getRange(1, 1, 1, expected.length)
      .getDisplayValues()[0];

    if (actual.join("|") !== expected.join("|")) {
      errors.push("Invalid headers: " + name);
    }
  }

  if (errors.length > 0) {
    Logger.log("FAILED: " + errors.join("; "));

    if (ss.getSheetByName("Activity_Log")) {
      recordActivity(
        "ERROR", "TEST", "SETUP_TEST", "",
        errors.join("; ")
      );
    }

    throw new Error(errors.join("; "));
  }

  recordActivity(
    "INFO", "TEST", "SETUP_TEST", "",
    "PASS: All five worksheet structures verified"
  );

  Logger.log("PASS: All five worksheet structures verified");
  ss.toast("All structural tests passed!", "Job Pilot Agent");
}

