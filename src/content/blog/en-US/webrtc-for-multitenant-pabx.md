---
title: "WebRTC access for multi-tenant PABX platforms"
description: "How WebRTC can coexist with SIP extensions, tenant domains, and existing FreeSWITCH or Asterisk deployments."
date: "2026-05-17"
author: "MNSCloud"
tags: ["WebRTC", "PABX", "Kamailio"]
status: "published"
featured: true
---

WebRTC does not need to replace traditional SIP extensions. In many real deployments, the same
customer will keep desk phones, softphones, trunks, and mobile apps while adding browser-based
calling for selected users.

The safe architecture is an edge layer dedicated to WebRTC. A Kamailio WebRTC edge can terminate
secure browser signaling, preserve tenant domain identity, and route registrations or calls toward
the correct downstream FreeSWITCH or Asterisk environment.

That domain boundary matters. Multiple customers may use extension `1000`, but the tenant domain
keeps each identity unique. A WebRTC edge should therefore validate the domain, request safe runtime
configuration from the API, and avoid hardcoded customer routing logic in public code.

This keeps the browser experience modern while preserving the operational model that already works
for SIP.
