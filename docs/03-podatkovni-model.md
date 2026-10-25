# 03 – Podatkovni model

Podatkovna baza: PostgreSQL (Supabase).

## Ključne entitete
- **Profile** – uporabnik sistema,
- **Building** – blok,
- **Membership** – članstvo uporabnika v bloku (z vlogo),
- **Category** – kategorija težave (hkrati stroka serviserja),
- **Issue** – prijava težave,
- **IssueEvent** – zgodovina sprememb prijave,
- **Comment** – komentar k prijavi,
- **Notification** – obvestilo uporabniku.

## Povezave
- Profile 1 : N Membership
- Building 1 : N Membership
- Profile 1 : N Building (kdo je zahteval blok)
- Building 1 : N Issue
- Category 1 : N Issue
- Category 1 : N Membership (stroka serviserja)
- Profile 1 : N Issue (prijavitelj)
- Profile 1 : N Issue (dodeljeni serviser)
- Issue 1 : N IssueEvent
- Issue 1 : N Comment
- Issue 1 : N Notification
- Profile 1 : N IssueEvent, Comment, Notification
- Issue 0..1 : N Issue (združena prijava kaže na glavno)

## Osnutek polj

### Profile
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | enak `auth.users.id` |
| full_name | text | |
| is_admin | boolean | privzeto `false` |
| created_at | timestamp | |

### Building
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| address | text | |
| status | enum | `PENDING`, `APPROVED`, `REJECTED` |
| invite_code | text, unique | ustvarjena ob odobritvi |
| requested_by | uuid, FK → Profile | |
| created_at | timestamp | |

### Membership
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → Profile | |
| building_id | uuid, FK → Building | par (user_id, building_id) je unikaten |
| role | enum | `MANAGER`, `RESIDENT`, `TECHNICIAN` |
| status | enum | `PENDING`, `APPROVED`, `REJECTED` |
| apartment | text | samo stanovalec |
| category_id | uuid, FK → Category | samo serviser |
| created_at | timestamp | |

### Category
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| name | text, unique | npr. elektrika, voda, dvigalo |

### Issue
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| building_id | uuid, FK → Building | |
| category_id | uuid, FK → Category | |
| reporter_id | uuid, FK → Profile | |
| assignee_id | uuid, FK → Profile | nullable |
| merged_into_id | uuid, FK → Issue | nullable |
| title | text | |
| description | text | |
| location | text | npr. klet, 3. nadstropje |
| priority | enum | `LOW`, `NORMAL`, `URGENT` |
| status | enum | `NEW`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED`, `REJECTED`, `MERGED` |
| created_at, updated_at | timestamp | |
| resolved_at | timestamp | nullable |

### IssueEvent
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| issue_id | uuid, FK → Issue | |
| actor_id | uuid, FK → Profile | |
| from_status, to_status | enum | |
| note | text | razlog ali opomba |
| created_at | timestamp | |

### Comment
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| issue_id | uuid, FK → Issue | |
| author_id | uuid, FK → Profile | |
| body | text | |
| photo_path | text | nullable |
| created_at | timestamp | |

### Notification
| Polje | Tip | Opomba |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → Profile | |
| issue_id | uuid, FK → Issue | |
| message | text | |
| is_read | boolean | |
| created_at | timestamp | |