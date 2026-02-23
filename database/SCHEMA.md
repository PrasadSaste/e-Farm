# E-FARM — MongoDB Schema Reference

## Collections

### farmers
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| phone | String | unique, required |
| email | String | unique, optional |
| password | String | bcrypt hashed |
| role | Enum | farmer / buyer / admin |
| location.state | String | |
| location.district | String | |
| landSize | Number | acres |
| waterSource | String | |
| primaryCrop | String | |
| bankDetails | Object | accountNo, ifsc, bankName |
| kccLimit | Number | ₹ credit limit |
| isVerified | Boolean | default false |
| rating | Number | 0-5 |

### crops
| Field | Type | Notes |
|-------|------|-------|
| farmerId | ObjectId | ref: Farmer |
| cropType | String | Wheat, Rice, etc. |
| area | Number | acres |
| stage | Enum | Planning/Sowing/Growing/Harvest/Sold |
| progress | Number | 0–100 |
| sowDate | Date | |
| harvestDate | Date | |
| yieldEstimate | Number | quintals |
| fertilizerSchedule | Array | [{name, qty, date, applied}] |
| pesticideSchedule | Array | [{name, dosage, date, applied}] |
| diseaseAlerts | Array | [{disease, risk, advisory}] |

### listings
| Field | Type | Notes |
|-------|------|-------|
| farmerId | ObjectId | ref: Farmer |
| cropType | String | |
| quantity | Number | quintals |
| pricePerQtl | Number | ₹ |
| grade | Enum | A / B / C |
| isActive | Boolean | default true |
| views | Number | |

### orders
| Field | Type | Notes |
|-------|------|-------|
| listingId | ObjectId | ref: Listing |
| buyerId | ObjectId | ref: Farmer |
| farmerId | ObjectId | ref: Farmer |
| quantity | Number | |
| totalAmount | Number | ₹ |
| status | Enum | Pending/Confirmed/In Transit/Delivered/Cancelled |
| payment.status | Enum | Pending/Paid/Refunded |

### schemes
Stores government scheme definitions and farmer applications.

### alerts
Weather, pest, market, and system notifications.

### marketprices
Daily mandi price records per crop type.
