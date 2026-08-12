# Data model

`profiles` map one-to-one to Auth users. `households` are the authorization boundary; `household_members` supports authenticated people and unauthenticated partner profiles. Financial preferences and life priorities shape deterministic advice.

Accounts own balances and optional holdings. Income, transactions, retirement plans, debts, goals, and insurance policies remain normalized. Immutable financial snapshots preserve history. Reviews group analysis; recommendations store all six factor scores and actions preserve decisions.

Statement upload rows hold private-object metadata and confirmation state. Review schedules create notifications. Audit events contain event metadata only—never financial payloads.
