"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock3,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { MumbaiEmployer } from "@/lib/mumbai-jobs";
import type { JobListing } from "@/lib/jobs/types";
import type { PublicCareerJob } from "@/lib/careers/public-careers";
import { INDIA_REGIONS } from "@/lib/jobs/locations";
import { ALL_JOB_COUNTRIES } from "@/lib/jobs/global-countries";
import CareerApplicationForm from "@/components/careers/career-application-form";

type Tab = "jobs" | "careers";

type Props = {
  jobs: JobListing[];
  initialTotal: number;
  sources: MumbaiEmployer[];
  checkedAt: string;
  pdsJobs?: PublicCareerJob[];
  initialTab?: Tab;
};
type JobsApi = {
  success: boolean;
  jobs?: JobListing[];
  total?: number;
  totalPages?: number;
  error?: string;
};
type DisplayJob = {
  key: string;
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  mode?: string;
  source: Tab;
  external?: JobListing;
  pds?: PublicCareerJob;
};
const PAGE_SIZE = 20;
const STORAGE_KEY = "pds-mumbai-saved-jobs-v1";

// PDS ROLE AUTOCOMPLETE V2

// PDS ROLE AUTOCOMPLETE V3
// Comprehensive job-role suggestions across major professional departments.

const JOB_ROLE_TERMS = [
  // DATA ANALYTICS & BUSINESS INTELLIGENCE
  "Data Analyst",
  "Junior Data Analyst",
  "Senior Data Analyst",
  "Lead Data Analyst",
  "Data Analytics Specialist",
  "Data Analytics Manager",
  "Data Analytics Consultant",
  "Data Visualization Analyst",
  "Data Visualization Specialist",
  "Business Analyst",
  "Junior Business Analyst",
  "Senior Business Analyst",
  "Technical Business Analyst",
  "Business Systems Analyst",
  "Business Intelligence Analyst",
  "Business Intelligence Developer",
  "Business Intelligence Engineer",
  "Business Intelligence Manager",
  "BI Consultant",
  "Power BI Developer",
  "Power BI Analyst",
  "Power BI Consultant",
  "Tableau Developer",
  "Tableau Analyst",
  "SQL Analyst",
  "SQL Developer",
  "Reporting Analyst",
  "MIS Executive",
  "MIS Analyst",
  "MIS Manager",
  "Excel Analyst",
  "Research Analyst",
  "Operations Analyst",
  "Product Analyst",
  "Marketing Analyst",
  "Sales Analyst",
  "Financial Data Analyst",
  "Customer Insights Analyst",
  "Decision Science Analyst",
  "Analytics Engineer",
  "Analytics Manager",
  "Data Quality Analyst",
  "Data Governance Analyst",
  "Data Privacy Analyst",

  // DATA SCIENCE & DATA ENGINEERING
  "Data Scientist",
  "Junior Data Scientist",
  "Senior Data Scientist",
  "Lead Data Scientist",
  "Principal Data Scientist",
  "Data Science Intern",
  "Data Science Consultant",
  "Data Science Manager",
  "Data Engineer",
  "Junior Data Engineer",
  "Senior Data Engineer",
  "Lead Data Engineer",
  "Big Data Engineer",
  "Data Platform Engineer",
  "Data Infrastructure Engineer",
  "Data Architect",
  "Big Data Architect",
  "Data Warehouse Developer",
  "Data Warehouse Engineer",
  "ETL Developer",
  "ETL Engineer",
  "ETL Tester",
  "Snowflake Developer",
  "Snowflake Engineer",
  "Databricks Engineer",
  "Apache Spark Developer",
  "Hadoop Developer",
  "Kafka Engineer",
  "Database Developer",
  "Database Administrator",
  "Database Engineer",
  "MongoDB Developer",
  "PostgreSQL Developer",
  "MySQL Developer",
  "Oracle Database Administrator",

  // ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  "AI Engineer",
  "Artificial Intelligence Engineer",
  "AI Developer",
  "AI Software Engineer",
  "AI Research Engineer",
  "AI Research Scientist",
  "AI Scientist",
  "AI Architect",
  "AI Consultant",
  "AI Product Manager",
  "AI Solutions Engineer",
  "Generative AI Engineer",
  "Generative AI Developer",
  "Generative AI Specialist",
  "LLM Engineer",
  "Large Language Model Engineer",
  "Prompt Engineer",
  "Prompt Engineering Specialist",
  "Machine Learning Engineer",
  "Junior Machine Learning Engineer",
  "Senior Machine Learning Engineer",
  "Machine Learning Scientist",
  "Machine Learning Researcher",
  "Machine Learning Architect",
  "ML Engineer",
  "MLOps Engineer",
  "MLOps Specialist",
  "Deep Learning Engineer",
  "Deep Learning Researcher",
  "Computer Vision Engineer",
  "Computer Vision Scientist",
  "NLP Engineer",
  "Natural Language Processing Engineer",
  "AI Automation Engineer",
  "AI Agent Developer",
  "AI Integration Engineer",
  "AI Model Trainer",
  "AI Data Annotator",
  "AI Quality Analyst",
  "Robotics AI Engineer",
  "Responsible AI Specialist",

  // SOFTWARE DEVELOPMENT
  "Software Engineer",
  "Junior Software Engineer",
  "Senior Software Engineer",
  "Lead Software Engineer",
  "Principal Software Engineer",
  "Staff Software Engineer",
  "Software Developer",
  "Junior Software Developer",
  "Senior Software Developer",
  "Software Development Engineer",
  "Software Development Engineer I",
  "Software Development Engineer II",
  "Software Development Engineer III",
  "SDE",
  "SDE 1",
  "SDE 2",
  "SDE 3",
  "Associate Software Engineer",
  "Graduate Engineer Trainee",
  "Software Architect",
  "Solutions Architect",
  "Technical Architect",
  "Engineering Manager",
  "Software Engineering Manager",
  "Technical Lead",
  "Tech Lead",
  "Engineering Lead",
  "Development Manager",
  "Application Developer",
  "Application Engineer",
  "Application Support Engineer",
  "Platform Engineer",
  "Systems Engineer",
  "Systems Developer",
  "Embedded Software Engineer",
  "Firmware Engineer",

  // FRONTEND DEVELOPMENT
  "Frontend Developer",
  "Frontend Engineer",
  "Junior Frontend Developer",
  "Senior Frontend Developer",
  "Lead Frontend Developer",
  "React Developer",
  "React.js Developer",
  "Next.js Developer",
  "Angular Developer",
  "Vue.js Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "HTML Developer",
  "CSS Developer",
  "Web Developer",
  "Web Application Developer",
  "Web Designer",
  "UI Developer",
  "Frontend Architect",

  // BACKEND DEVELOPMENT
  "Backend Developer",
  "Backend Engineer",
  "Junior Backend Developer",
  "Senior Backend Developer",
  "Lead Backend Engineer",
  "Node.js Developer",
  "Express.js Developer",
  "Python Developer",
  "Django Developer",
  "Flask Developer",
  "FastAPI Developer",
  "Java Developer",
  "Spring Boot Developer",
  "PHP Developer",
  "Laravel Developer",
  "Ruby Developer",
  "Ruby on Rails Developer",
  "Go Developer",
  "Golang Developer",
  "Rust Developer",
  "C Developer",
  "C++ Developer",
  "C# Developer",
  ".NET Developer",
  "ASP.NET Developer",
  "API Developer",
  "REST API Developer",
  "GraphQL Developer",
  "Microservices Developer",

  // FULL STACK DEVELOPMENT
  "Full Stack Developer",
  "Full Stack Engineer",
  "Junior Full Stack Developer",
  "Senior Full Stack Developer",
  "Lead Full Stack Developer",
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "MEVN Stack Developer",
  "Java Full Stack Developer",
  "Python Full Stack Developer",
  ".NET Full Stack Developer",
  "React Node.js Developer",
  "Next.js Full Stack Developer",

  // MOBILE APPLICATION DEVELOPMENT
  "Mobile App Developer",
  "Mobile Application Engineer",
  "Android Developer",
  "Senior Android Developer",
  "iOS Developer",
  "Senior iOS Developer",
  "Flutter Developer",
  "React Native Developer",
  "Kotlin Developer",
  "Swift Developer",
  "Cross Platform App Developer",
  "Mobile Software Engineer",
  "Mobile App Tester",

  // CLOUD COMPUTING
  "Cloud Engineer",
  "Junior Cloud Engineer",
  "Senior Cloud Engineer",
  "Cloud Architect",
  "Cloud Solutions Architect",
  "Cloud Administrator",
  "Cloud Consultant",
  "Cloud Support Engineer",
  "Cloud Security Engineer",
  "Cloud Infrastructure Engineer",
  "Cloud Platform Engineer",
  "Cloud Operations Engineer",
  "AWS Engineer",
  "AWS Cloud Engineer",
  "AWS Solutions Architect",
  "AWS DevOps Engineer",
  "Azure Engineer",
  "Azure Cloud Engineer",
  "Azure Administrator",
  "Azure Solutions Architect",
  "Google Cloud Engineer",
  "GCP Engineer",
  "GCP Cloud Architect",
  "Multi Cloud Engineer",
  "Cloud Migration Engineer",
  "Cloud Automation Engineer",
  "Cloud Reliability Engineer",
  "Cloud FinOps Analyst",

  // DEVOPS & INFRASTRUCTURE
  "DevOps Engineer",
  "Junior DevOps Engineer",
  "Senior DevOps Engineer",
  "Lead DevOps Engineer",
  "DevOps Architect",
  "DevOps Consultant",
  "Site Reliability Engineer",
  "SRE Engineer",
  "Platform Reliability Engineer",
  "Infrastructure Engineer",
  "Infrastructure Architect",
  "Infrastructure Automation Engineer",
  "Linux Administrator",
  "Linux Engineer",
  "Windows Administrator",
  "System Administrator",
  "System Engineer",
  "Network Administrator",
  "Network Engineer",
  "Network Security Engineer",
  "Network Architect",
  "IT Infrastructure Engineer",
  "IT Support Engineer",
  "IT Support Specialist",
  "IT Administrator",
  "IT Manager",
  "IT Operations Manager",
  "Kubernetes Engineer",
  "Docker Engineer",
  "Terraform Engineer",
  "CI CD Engineer",
  "Build and Release Engineer",
  "Release Manager",
  "Deployment Engineer",
  "Production Support Engineer",

  // CYBERSECURITY
  "Cybersecurity Analyst",
  "Junior Cybersecurity Analyst",
  "Senior Cybersecurity Analyst",
  "Cybersecurity Engineer",
  "Cybersecurity Consultant",
  "Cybersecurity Specialist",
  "Cybersecurity Architect",
  "Cybersecurity Manager",
  "Cybersecurity Intern",
  "Information Security Analyst",
  "Information Security Engineer",
  "Information Security Manager",
  "Security Analyst",
  "Security Engineer",
  "Security Architect",
  "SOC Analyst",
  "SOC Analyst L1",
  "SOC Analyst L2",
  "SOC Analyst L3",
  "SOC Engineer",
  "SOC Manager",
  "Security Operations Analyst",
  "Security Operations Engineer",
  "Penetration Tester",
  "Ethical Hacker",
  "Vulnerability Assessment Analyst",
  "VAPT Engineer",
  "Application Security Engineer",
  "Application Security Analyst",
  "Cloud Security Analyst",
  "Cloud Security Architect",
  "Network Security Analyst",
  "Incident Response Analyst",
  "Incident Response Engineer",
  "Digital Forensics Analyst",
  "Threat Intelligence Analyst",
  "Threat Hunter",
  "Malware Analyst",
  "Security Researcher",
  "IAM Engineer",
  "Identity Access Management Analyst",
  "GRC Analyst",
  "IT Risk Analyst",
  "IT Security Auditor",
  "Cyber Risk Consultant",
  "Security Compliance Analyst",
  "Chief Information Security Officer",

  // SOFTWARE TESTING & QUALITY ASSURANCE
  "QA Engineer",
  "QA Analyst",
  "Quality Assurance Engineer",
  "Quality Assurance Analyst",
  "Quality Assurance Manager",
  "Software Tester",
  "Software Test Engineer",
  "Manual Tester",
  "Automation Tester",
  "Automation Test Engineer",
  "Selenium Tester",
  "Selenium Automation Engineer",
  "API Tester",
  "API Test Engineer",
  "Performance Test Engineer",
  "Load Test Engineer",
  "Security Test Engineer",
  "Mobile App Tester",
  "Web Application Tester",
  "SDET",
  "SDET 1",
  "SDET 2",
  "Test Automation Architect",
  "Test Lead",
  "Testing Manager",
  "UAT Analyst",
  "Regression Tester",
  "Game Tester",

  // DIGITAL MARKETING
  "Digital Marketing Executive",
  "Digital Marketing Specialist",
  "Digital Marketing Manager",
  "Digital Marketing Analyst",
  "Digital Marketing Intern",
  "Head of Digital Marketing",
  "SEO Executive",
  "SEO Specialist",
  "SEO Analyst",
  "SEO Manager",
  "SEM Specialist",
  "Search Engine Marketing Executive",
  "Performance Marketing Executive",
  "Performance Marketing Specialist",
  "Performance Marketing Manager",
  "Google Ads Specialist",
  "Google Ads Executive",
  "Meta Ads Specialist",
  "Paid Media Specialist",
  "PPC Specialist",
  "PPC Manager",
  "Social Media Executive",
  "Social Media Specialist",
  "Social Media Manager",
  "Social Media Strategist",
  "Social Media Analyst",
  "Content Marketing Executive",
  "Content Marketing Specialist",
  "Content Marketing Manager",
  "Content Strategist",
  "Content Writer",
  "SEO Content Writer",
  "Copywriter",
  "Email Marketing Specialist",
  "CRM Marketing Specialist",
  "Growth Marketing Manager",
  "Growth Hacker",
  "Growth Marketing Analyst",
  "Affiliate Marketing Executive",
  "Affiliate Marketing Manager",
  "Influencer Marketing Executive",
  "Influencer Marketing Manager",
  "Brand Executive",
  "Brand Manager",
  "Brand Strategist",
  "Marketing Executive",
  "Marketing Manager",
  "Marketing Coordinator",
  "Marketing Research Analyst",
  "Marketing Operations Analyst",
  "Marketing Automation Specialist",
  "Campaign Manager",
  "Advertising Executive",
  "Advertising Manager",
  "Public Relations Executive",
  "Public Relations Manager",
  "Communications Specialist",
  "Corporate Communications Manager",

  // PRODUCT & PROJECT MANAGEMENT
  "Product Manager",
  "Associate Product Manager",
  "Junior Product Manager",
  "Senior Product Manager",
  "Technical Product Manager",
  "AI Product Manager",
  "Digital Product Manager",
  "Product Owner",
  "Product Lead",
  "Group Product Manager",
  "Director of Product",
  "Product Operations Manager",
  "Product Development Manager",
  "Product Marketing Manager",
  "Project Manager",
  "Junior Project Manager",
  "Senior Project Manager",
  "Technical Project Manager",
  "IT Project Manager",
  "Project Coordinator",
  "Project Executive",
  "Project Lead",
  "Program Manager",
  "Technical Program Manager",
  "Delivery Manager",
  "Delivery Lead",
  "Implementation Manager",
  "Implementation Consultant",
  "Scrum Master",
  "Agile Coach",
  "Agile Project Manager",
  "PMO Analyst",
  "PMO Executive",
  "PMO Manager",

  // UI UX & CREATIVE DESIGN
  "UI Designer",
  "UX Designer",
  "UI UX Designer",
  "Junior UI UX Designer",
  "Senior UI UX Designer",
  "Product Designer",
  "Digital Product Designer",
  "Visual Designer",
  "Visual Communication Designer",
  "Graphic Designer",
  "Junior Graphic Designer",
  "Senior Graphic Designer",
  "Creative Designer",
  "Brand Designer",
  "Logo Designer",
  "Motion Graphic Designer",
  "Motion Designer",
  "Animation Designer",
  "2D Animator",
  "3D Animator",
  "3D Artist",
  "Illustrator",
  "Video Editor",
  "Video Production Specialist",
  "Video Producer",
  "Photographer",
  "Photo Editor",
  "Creative Director",
  "Art Director",
  "Design Lead",
  "Design Manager",
  "UX Researcher",
  "UX Writer",
  "Interaction Designer",
  "Web Designer",
  "Figma Designer",
  "Game Designer",
  "Game Developer",
  "Unity Developer",
  "Unreal Engine Developer",
  "AR VR Developer",
  "3D Modeler",
  "CAD Designer",
  "Interior Designer",
  "Fashion Designer",

  // FINANCE & ACCOUNTING
  "Financial Analyst",
  "Junior Financial Analyst",
  "Senior Financial Analyst",
  "Finance Executive",
  "Finance Associate",
  "Finance Manager",
  "Senior Finance Manager",
  "Financial Controller",
  "Finance Director",
  "Chief Financial Officer",
  "Accountant",
  "Junior Accountant",
  "Senior Accountant",
  "Accounts Executive",
  "Accounts Assistant",
  "Accounts Manager",
  "Accounts Payable Executive",
  "Accounts Receivable Executive",
  "Tax Analyst",
  "Tax Consultant",
  "Tax Accountant",
  "GST Executive",
  "GST Consultant",
  "Audit Associate",
  "Internal Auditor",
  "External Auditor",
  "Audit Manager",
  "Financial Planning Analyst",
  "FP&A Analyst",
  "FP&A Manager",
  "Treasury Analyst",
  "Treasury Manager",
  "Payroll Executive",
  "Payroll Specialist",
  "Payroll Manager",
  "Billing Executive",
  "Billing Analyst",
  "Revenue Analyst",
  "Revenue Manager",
  "Credit Analyst",
  "Investment Analyst",
  "Equity Research Analyst",
  "Risk Analyst",
  "Financial Risk Analyst",
  "Compliance Analyst",
  "Cost Accountant",
  "Management Accountant",
  "Chartered Accountant",
  "Company Secretary",
  "Budget Analyst",
  "Pricing Analyst",

  // BANKING, INSURANCE & FINTECH
  "Banking Executive",
  "Banking Associate",
  "Banking Operations Executive",
  "Banking Operations Manager",
  "Relationship Manager",
  "Assistant Relationship Manager",
  "Customer Relationship Manager",
  "Branch Manager",
  "Assistant Branch Manager",
  "Bank Teller",
  "Loan Officer",
  "Loan Processing Executive",
  "Credit Officer",
  "Credit Manager",
  "Risk Manager",
  "Fraud Analyst",
  "Fraud Prevention Analyst",
  "Fraud Investigation Specialist",
  "KYC Analyst",
  "AML Analyst",
  "Anti Money Laundering Analyst",
  "Compliance Officer",
  "Investment Banker",
  "Investment Banking Analyst",
  "Investment Banking Associate",
  "Wealth Manager",
  "Portfolio Manager",
  "Portfolio Analyst",
  "Insurance Advisor",
  "Insurance Executive",
  "Insurance Underwriter",
  "Insurance Claims Analyst",
  "Claims Processing Executive",
  "Fintech Analyst",
  "Fintech Product Manager",
  "Payments Analyst",
  "Payment Operations Executive",
  "UPI Operations Analyst",
  "Merchant Onboarding Executive",
  "Merchant Success Manager",

  // HUMAN RESOURCES & RECRUITMENT
  "HR Executive",
  "HR Associate",
  "HR Assistant",
  "HR Generalist",
  "HR Specialist",
  "HR Manager",
  "Senior HR Manager",
  "HR Business Partner",
  "HRBP",
  "HR Operations Executive",
  "HR Operations Manager",
  "HR Analyst",
  "HR Data Analyst",
  "HRIS Analyst",
  "HRIS Specialist",
  "Talent Acquisition Executive",
  "Talent Acquisition Specialist",
  "Talent Acquisition Manager",
  "Recruiter",
  "IT Recruiter",
  "Technical Recruiter",
  "Non IT Recruiter",
  "Recruitment Consultant",
  "Recruitment Specialist",
  "Recruitment Manager",
  "Sourcing Specialist",
  "Talent Sourcer",
  "Campus Recruiter",
  "Employee Relations Specialist",
  "Employee Engagement Executive",
  "Learning and Development Executive",
  "Learning and Development Manager",
  "Training Coordinator",
  "Training Manager",
  "Compensation and Benefits Analyst",
  "People Operations Executive",
  "People Operations Manager",
  "People Analytics Analyst",
  "HR Director",
  "Head of Human Resources",

  // SALES & BUSINESS DEVELOPMENT
  "Sales Executive",
  "Sales Associate",
  "Sales Representative",
  "Senior Sales Executive",
  "Sales Manager",
  "Senior Sales Manager",
  "Regional Sales Manager",
  "Area Sales Manager",
  "Territory Sales Manager",
  "National Sales Manager",
  "Inside Sales Executive",
  "Inside Sales Representative",
  "Inside Sales Manager",
  "Field Sales Executive",
  "Field Sales Officer",
  "Field Sales Manager",
  "Business Development Executive",
  "Business Development Associate",
  "Business Development Representative",
  "Business Development Manager",
  "Senior Business Development Manager",
  "Business Development Director",
  "BDE",
  "BDM",
  "Account Executive",
  "Account Manager",
  "Key Account Manager",
  "Strategic Account Manager",
  "Enterprise Account Executive",
  "Enterprise Sales Manager",
  "Sales Development Representative",
  "SDR",
  "Lead Generation Executive",
  "Lead Generation Specialist",
  "Pre Sales Executive",
  "Pre Sales Consultant",
  "Sales Engineer",
  "Solutions Consultant",
  "Customer Success Executive",
  "Customer Success Associate",
  "Customer Success Manager",
  "Customer Success Specialist",
  "Client Relationship Executive",
  "Client Relationship Manager",
  "Partnerships Manager",
  "Channel Sales Manager",
  "Retail Sales Executive",
  "Retail Store Manager",
  "Sales Operations Analyst",
  "Sales Operations Manager",

  // OPERATIONS & BUSINESS MANAGEMENT
  "Operations Executive",
  "Operations Associate",
  "Operations Analyst",
  "Operations Coordinator",
  "Operations Specialist",
  "Operations Manager",
  "Senior Operations Manager",
  "Business Operations Analyst",
  "Business Operations Manager",
  "Business Manager",
  "Business Consultant",
  "Management Consultant",
  "Strategy Analyst",
  "Strategy Consultant",
  "Strategy Manager",
  "Business Strategy Manager",
  "Process Analyst",
  "Process Associate",
  "Process Executive",
  "Process Manager",
  "Business Process Analyst",
  "Business Process Manager",
  "Quality Analyst",
  "Quality Manager",
  "Quality Control Executive",
  "Continuous Improvement Specialist",
  "Business Excellence Manager",
  "General Manager",
  "Assistant General Manager",
  "Deputy General Manager",
  "Executive Assistant",
  "Office Administrator",
  "Office Manager",
  "Administrative Executive",
  "Administrative Assistant",
  "Management Trainee",
  "Operations Trainee",
  "Chief Operating Officer",

  // CUSTOMER SERVICE & BPO
  "Customer Support Executive",
  "Customer Support Associate",
  "Customer Support Specialist",
  "Customer Support Manager",
  "Customer Service Executive",
  "Customer Service Representative",
  "Customer Service Manager",
  "Customer Care Executive",
  "Customer Care Associate",
  "Customer Experience Executive",
  "Customer Experience Manager",
  "Customer Success Analyst",
  "Technical Support Executive",
  "Technical Support Engineer",
  "Help Desk Executive",
  "Help Desk Technician",
  "Service Desk Analyst",
  "Service Desk Engineer",
  "Service Desk Manager",
  "Call Center Executive",
  "Call Center Agent",
  "Call Center Manager",
  "BPO Executive",
  "BPO Associate",
  "BPO Team Leader",
  "BPO Operations Manager",
  "Voice Process Executive",
  "Non Voice Process Executive",
  "Chat Support Executive",
  "Email Support Executive",
  "International Voice Process Executive",
  "International Customer Support Executive",
  "Customer Retention Executive",
  "Customer Escalation Specialist",

  // CORE ENGINEERING
  "Mechanical Engineer",
  "Junior Mechanical Engineer",
  "Senior Mechanical Engineer",
  "Mechanical Design Engineer",
  "Manufacturing Engineer",
  "Production Engineer",
  "Industrial Engineer",
  "Maintenance Engineer",
  "Automobile Engineer",
  "Automotive Engineer",
  "Electrical Engineer",
  "Junior Electrical Engineer",
  "Senior Electrical Engineer",
  "Electrical Design Engineer",
  "Electronics Engineer",
  "Electronics Design Engineer",
  "Electronics and Communication Engineer",
  "Embedded Systems Engineer",
  "VLSI Engineer",
  "VLSI Design Engineer",
  "Semiconductor Engineer",
  "Hardware Engineer",
  "PCB Design Engineer",
  "Civil Engineer",
  "Junior Civil Engineer",
  "Senior Civil Engineer",
  "Structural Engineer",
  "Site Engineer",
  "Construction Engineer",
  "Construction Manager",
  "Planning Engineer",
  "Quantity Surveyor",
  "Project Engineer",
  "Chemical Engineer",
  "Process Engineer",
  "Instrumentation Engineer",
  "Control Systems Engineer",
  "Automation Engineer",
  "PLC Engineer",
  "SCADA Engineer",
  "Robotics Engineer",
  "Mechatronics Engineer",
  "Aerospace Engineer",
  "Aeronautical Engineer",
  "Biomedical Engineer",
  "Environmental Engineer",
  "Energy Engineer",
  "Solar Engineer",
  "Renewable Energy Engineer",

  // MANUFACTURING & PRODUCTION
  "Production Executive",
  "Production Supervisor",
  "Production Manager",
  "Plant Engineer",
  "Plant Manager",
  "Factory Manager",
  "Manufacturing Supervisor",
  "Manufacturing Manager",
  "Machine Operator",
  "CNC Operator",
  "CNC Programmer",
  "Quality Control Inspector",
  "Quality Control Engineer",
  "Quality Assurance Inspector",
  "Quality Assurance Manager",
  "Industrial Maintenance Technician",
  "Maintenance Supervisor",
  "Safety Officer",
  "Safety Engineer",
  "EHS Executive",
  "EHS Manager",
  "Production Planning Executive",
  "Production Planning Manager",
  "Materials Manager",
  "Packaging Engineer",

  // SUPPLY CHAIN, PROCUREMENT & LOGISTICS
  "Supply Chain Analyst",
  "Supply Chain Executive",
  "Supply Chain Specialist",
  "Supply Chain Manager",
  "Supply Chain Consultant",
  "Procurement Executive",
  "Procurement Analyst",
  "Procurement Specialist",
  "Procurement Manager",
  "Purchase Executive",
  "Purchase Officer",
  "Purchase Manager",
  "Sourcing Executive",
  "Sourcing Manager",
  "Vendor Management Executive",
  "Vendor Manager",
  "Inventory Executive",
  "Inventory Analyst",
  "Inventory Manager",
  "Warehouse Executive",
  "Warehouse Supervisor",
  "Warehouse Manager",
  "Logistics Executive",
  "Logistics Coordinator",
  "Logistics Analyst",
  "Logistics Manager",
  "Transportation Coordinator",
  "Transportation Manager",
  "Dispatch Executive",
  "Dispatch Manager",
  "Fleet Manager",
  "Freight Forwarding Executive",
  "Import Export Executive",
  "Import Export Manager",
  "Customs Clearance Executive",
  "Shipping Executive",
  "Shipping Coordinator",
  "Delivery Operations Manager",
  "Demand Planner",
  "Supply Planner",
  "Material Planner",
  "Distribution Manager",

  // E-COMMERCE & RETAIL
  "Ecommerce Executive",
  "Ecommerce Specialist",
  "Ecommerce Manager",
  "Ecommerce Operations Executive",
  "Ecommerce Operations Manager",
  "Marketplace Executive",
  "Marketplace Manager",
  "Amazon Marketplace Specialist",
  "Flipkart Marketplace Specialist",
  "Shopify Developer",
  "Shopify Store Manager",
  "D2C Operations Manager",
  "D2C Brand Manager",
  "Category Executive",
  "Category Analyst",
  "Category Manager",
  "Merchandising Executive",
  "Merchandising Manager",
  "Retail Executive",
  "Retail Associate",
  "Retail Store Manager",
  "Store Supervisor",
  "Store Operations Manager",
  "Retail Operations Manager",
  "Product Listing Executive",
  "Catalog Executive",
  "Catalog Manager",
  "Order Management Executive",
  "Fulfillment Executive",
  "Fulfillment Manager",
  "Pricing Executive",
  "Pricing Manager",
  "Customer Experience Manager",

  // EDUCATION & EDTECH
  "Teacher",
  "School Teacher",
  "Primary School Teacher",
  "Secondary School Teacher",
  "English Teacher",
  "Mathematics Teacher",
  "Science Teacher",
  "Computer Science Teacher",
  "Physics Teacher",
  "Chemistry Teacher",
  "Biology Teacher",
  "Economics Teacher",
  "Commerce Teacher",
  "Assistant Teacher",
  "Teaching Assistant",
  "Tutor",
  "Online Tutor",
  "Academic Tutor",
  "Subject Matter Expert",
  "Academic Counselor",
  "Career Counselor",
  "Admission Counselor",
  "Education Counselor",
  "Student Counselor",
  "Student Success Executive",
  "Student Success Manager",
  "Academic Coordinator",
  "Academic Manager",
  "Academic Director",
  "Curriculum Developer",
  "Curriculum Designer",
  "Instructional Designer",
  "Instructional Content Developer",
  "Educational Content Writer",
  "Question Bank Developer",
  "Assessment Specialist",
  "Examination Coordinator",
  "Examination Officer",
  "EdTech Product Manager",
  "Learning Experience Designer",
  "Learning Management System Administrator",
  "LMS Administrator",
  "Online Course Instructor",
  "Technical Trainer",
  "Corporate Trainer",
  "Programming Instructor",
  "Data Science Trainer",
  "Digital Marketing Trainer",
  "Training Specialist",
  "School Administrator",
  "School Principal",
  "Vice Principal",
  "Education Program Manager",

  // LEGAL, RISK & COMPLIANCE
  "Legal Associate",
  "Legal Executive",
  "Legal Advisor",
  "Legal Counsel",
  "Corporate Lawyer",
  "Corporate Legal Counsel",
  "Legal Manager",
  "Legal Consultant",
  "Legal Research Analyst",
  "Legal Assistant",
  "Paralegal",
  "Contract Analyst",
  "Contract Manager",
  "Contract Specialist",
  "Compliance Executive",
  "Compliance Analyst",
  "Compliance Officer",
  "Compliance Manager",
  "Regulatory Compliance Analyst",
  "Regulatory Affairs Specialist",
  "Risk Analyst",
  "Risk Consultant",
  "Risk Manager",
  "Enterprise Risk Manager",
  "Internal Control Analyst",
  "Internal Audit Associate",
  "Internal Audit Manager",
  "Governance Analyst",
  "Data Protection Officer",
  "Privacy Analyst",
  "Privacy Counsel",
  "Company Secretary",

  // MEDIA, CONTENT & COMMUNICATIONS
  "Journalist",
  "Content Writer",
  "Technical Writer",
  "Technical Documentation Specialist",
  "Creative Writer",
  "Copywriter",
  "Script Writer",
  "Editor",
  "Content Editor",
  "Proofreader",
  "Content Reviewer",
  "Content Moderator",
  "Content Strategist",
  "Digital Content Creator",
  "Social Media Content Creator",
  "Video Content Creator",
  "YouTube Content Manager",
  "Podcast Producer",
  "Video Producer",
  "Film Editor",
  "News Reporter",
  "News Editor",
  "Media Planner",
  "Media Buyer",
  "Media Analyst",
  "Media Relations Executive",
  "Communications Executive",
  "Communications Manager",
  "Community Manager",
  "Community Executive",
  "Public Relations Specialist",
  "Public Relations Manager",
  "Event Coordinator",
  "Event Manager",
  "Event Marketing Specialist",

  // REAL ESTATE & CONSTRUCTION
  "Real Estate Executive",
  "Real Estate Consultant",
  "Real Estate Agent",
  "Real Estate Sales Executive",
  "Property Consultant",
  "Property Manager",
  "Property Sales Manager",
  "Leasing Executive",
  "Leasing Manager",
  "Facility Executive",
  "Facility Manager",
  "Facilities Coordinator",
  "Construction Project Manager",
  "Construction Site Supervisor",
  "Site Engineer",
  "Site Supervisor",
  "Civil Site Engineer",
  "Structural Design Engineer",
  "Architect",
  "Junior Architect",
  "Senior Architect",
  "Architectural Designer",
  "Interior Architect",
  "Interior Designer",
  "Building Services Engineer",
  "MEP Engineer",
  "Quantity Surveyor",
  "Cost Estimator",
  "Planning Engineer",

  // AGRICULTURE, ENVIRONMENT & ENERGY
  "Agriculture Officer",
  "Agriculture Engineer",
  "Agronomist",
  "Agriculture Research Associate",
  "Agriculture Sales Executive",
  "Agriculture Field Officer",
  "Food Technologist",
  "Food Safety Officer",
  "Food Quality Analyst",
  "Food Production Supervisor",
  "Environmental Engineer",
  "Environmental Analyst",
  "Environmental Consultant",
  "Sustainability Analyst",
  "Sustainability Consultant",
  "Sustainability Manager",
  "ESG Analyst",
  "ESG Consultant",
  "ESG Manager",
  "Energy Analyst",
  "Energy Engineer",
  "Energy Manager",
  "Solar Design Engineer",
  "Solar Project Engineer",
  "Wind Energy Engineer",
  "Renewable Energy Analyst",
  "Renewable Energy Project Manager",
  "Climate Risk Analyst",
  "Carbon Analyst",

  // RESEARCH & SCIENTIFIC ROLES
  "Research Assistant",
  "Research Associate",
  "Research Analyst",
  "Research Scientist",
  "Senior Research Scientist",
  "Research Engineer",
  "Research Manager",
  "Market Research Analyst",
  "Market Research Executive",
  "Market Research Manager",
  "User Researcher",
  "UX Researcher",
  "Quantitative Researcher",
  "Quantitative Analyst",
  "Quantitative Developer",
  "Quant Researcher",
  "Statistician",
  "Statistical Analyst",
  "Economist",
  "Economic Research Analyst",
  "Policy Analyst",
  "Policy Researcher",
  "Laboratory Research Associate",
  "Biotechnology Research Associate",
  "Bioinformatics Analyst",
  "Bioinformatics Scientist",

  // BLOCKCHAIN, WEB3 & EMERGING TECHNOLOGY
  "Blockchain Developer",
  "Blockchain Engineer",
  "Blockchain Architect",
  "Smart Contract Developer",
  "Solidity Developer",
  "Web3 Developer",
  "Web3 Engineer",
  "Blockchain Security Engineer",
  "Cryptography Engineer",
  "Cryptography Researcher",
  "IoT Developer",
  "IoT Engineer",
  "IoT Solutions Architect",
  "Embedded IoT Engineer",
  "AR Developer",
  "VR Developer",
  "AR VR Engineer",
  "Robotics Software Engineer",
  "Robotics Automation Engineer",
  "Computer Vision Developer",
  "Digital Twin Engineer",
  "Edge Computing Engineer",

  // INTERNSHIPS & ENTRY-LEVEL ROLES
  "Software Development Intern",
  "Frontend Development Intern",
  "Backend Development Intern",
  "Full Stack Development Intern",
  "Web Development Intern",
  "Python Development Intern",
  "Java Development Intern",
  "Mobile App Development Intern",
  "Data Analyst Intern",
  "Data Science Intern",
  "Data Engineering Intern",
  "Business Analyst Intern",
  "AI Intern",
  "Machine Learning Intern",
  "Generative AI Intern",
  "Cybersecurity Intern",
  "Cloud Computing Intern",
  "DevOps Intern",
  "Software Testing Intern",
  "UI UX Design Intern",
  "Graphic Design Intern",
  "Digital Marketing Intern",
  "Social Media Marketing Intern",
  "Content Writing Intern",
  "Marketing Intern",
  "Finance Intern",
  "Accounting Intern",
  "Investment Banking Intern",
  "HR Intern",
  "Recruitment Intern",
  "Sales Intern",
  "Business Development Intern",
  "Operations Intern",
  "Product Management Intern",
  "Project Management Intern",
  "Research Intern",
  "Management Trainee",
  "Graduate Trainee",
  "Graduate Engineer Trainee",
  "Associate Engineer",
  "Junior Developer",
  "Junior Analyst",
  "Junior Executive",
  "Technical Intern",

  // SENIOR LEADERSHIP & EXECUTIVE ROLES
  "Team Lead",
  "Technical Lead",
  "Engineering Lead",
  "Project Lead",
  "Department Head",
  "Head of Engineering",
  "Head of Technology",
  "Head of Data Science",
  "Head of Analytics",
  "Head of Marketing",
  "Head of Sales",
  "Head of Operations",
  "Head of Finance",
  "Head of Human Resources",
  "Head of Product",
  "Head of Customer Success",
  "Head of Information Security",
  "Director of Engineering",
  "Director of Technology",
  "Director of Operations",
  "Director of Marketing",
  "Director of Sales",
  "Director of Product",
  "Director of Finance",
  "Vice President Engineering",
  "Vice President Product",
  "Vice President Sales",
  "Vice President Marketing",
  "Vice President Operations",
  "Chief Executive Officer",
  "Chief Technology Officer",
  "Chief Information Officer",
  "Chief Information Security Officer",
  "Chief Operating Officer",
  "Chief Financial Officer",
  "Chief Marketing Officer",
  "Chief Product Officer",
  "Chief Data Officer",
] as const;

const inputClass =
  "h-11 w-full rounded-lg border border-[#d8d4d3] bg-white px-3 text-sm text-[#25212a] outline-none focus:border-[#7d0a2b] focus:ring-2 focus:ring-[#7d0a2b]/10";
const primary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#7d0a2b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#59051f]";
const outline =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm font-semibold text-[#7d0a2b] hover:bg-[#fcf3f6]";
function locationOf(j: JobListing) {
  return (
    j.locationLabel ||
    [j.city, j.state, j.country].filter(Boolean).join(", ") ||
    j.location ||
    "Location not specified"
  );
}
function https(value?: string | null) {
  try {
    if (!value) return null;
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
function normal(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]/g, "");
}
function Logo({ name }: { name: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f9eaf0] font-bold text-[#7d0a2b]">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => x[0] || "")
        .join("")
        .toUpperCase()}
    </span>
  );
}
function dateLabel(value: string | null) {
  if (!value) return "Open until filled";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Open until filled"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}
function paragraphs(value: string) {
  return value
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function CareerHeroAnimation() {
  return (
    <div
      aria-label="Animated career opportunities"
      className="relative mx-auto h-[350px] w-full max-w-[450px] select-none sm:h-[380px]"
    >
      <style>{`
        @keyframes pdsCareerFloatOne {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes pdsCareerFloatTwo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        @keyframes pdsCareerFloatThree {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pdsCareerOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pdsCareerEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pds-career-card-one {
          animation: pdsCareerFloatOne 6s ease-in-out infinite;
        }

        .pds-career-card-two {
          animation: pdsCareerFloatTwo 7s ease-in-out infinite;
        }

        .pds-career-card-three {
          animation: pdsCareerFloatThree 5.5s ease-in-out infinite;
        }

        .pds-career-orbit {
          animation: pdsCareerOrbit 65s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .pds-career-card-one,
          .pds-career-card-two,
          .pds-career-card-three,
          .pds-career-orbit {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background geometry */}
      <div
        aria-hidden="true"
        className="absolute inset-[20px] rounded-full border border-white/10"
      />

      <div
        aria-hidden="true"
        className="absolute inset-[55px] rounded-full border border-white/[0.07]"
      />

      <div
        aria-hidden="true"
        className="pds-career-orbit absolute inset-[35px] rounded-full border border-dashed border-white/20"
      >
        <span className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 rounded-full bg-white/70" />
      </div>

      {/* Data Analyst */}
      <div className="pds-career-card-one absolute left-2 top-10 z-10 w-[70%] rounded-2xl border border-white/80 bg-white/95 p-4 text-[#6b0a26] shadow-[0_18px_45px_rgba(30,0,14,0.18)] backdrop-blur-md sm:left-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 19V11" />
              <path d="M10 19V5" />
              <path d="M15 19v-8" />
              <path d="M20 19V8" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-base font-bold">Data Analyst</p>
            <p className="mt-1 text-xs text-[#76646b]">India</p>
          </div>
        </div>
      </div>

      {/* Software Engineer - Primary card */}
      <div className="pds-career-card-two absolute right-0 top-[125px] z-20 w-[88%] rounded-2xl border border-[#f5e9ed] bg-white p-5 text-[#6b0a26] shadow-[0_24px_60px_rgba(30,0,14,0.24)] sm:top-[135px]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <BriefcaseBusiness size={30} strokeWidth={1.7} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold tracking-tight sm:text-xl">
              Software Engineer
            </p>

            <p className="mt-2 text-sm text-[#76646b]">United Kingdom</p>
          </div>

          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#8a0c34]"
          />
        </div>
      </div>

      {/* Digital Marketing */}
      <div className="pds-career-card-three absolute bottom-8 right-2 z-30 w-[78%] rounded-2xl border border-white/80 bg-white/95 px-4 py-4 text-[#6b0a26] shadow-[0_18px_45px_rgba(30,0,14,0.18)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faedf1]">
            <ArrowUpRight size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold sm:text-base">Digital Marketing</p>
            <p className="mt-1 text-xs text-[#76646b]">Remote Opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function MumbaiJobsClient({
  jobs,
  initialTotal,
  sources,
  checkedAt,
  pdsJobs = [],
  initialTab = "jobs",
}: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const pds = tab === "careers";
  const [items, setItems] = useState<JobListing[]>(jobs);
  const [externalTotal, setExternalTotal] = useState(initialTotal);
  const [externalPages, setExternalPages] = useState(
    Math.ceil(initialTotal / PAGE_SIZE),
  );
  const [search, setSearch] = useState("");

  // PDS LIVE JOB SUGGESTIONS
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const [countryCode, setCountryCode] = useState("ALL");
  const [quickLocation, setQuickLocation] = useState("All");
  const [state, setState] = useState("All");
  const [city, setCity] = useState("All");
  const [company, setCompany] = useState("All");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [moreFilters, setMoreFilters] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCompanies, setAvailableCompanies] = useState<
    Array<[string, string]>
  >([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search), 350);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    try {
      const x: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(x))
        setSavedIds(x.filter((v): v is string => typeof v === "string"));
    } catch {}
    setSavedLoaded(true);
  }, []);
  function save(key: string) {
    setSavedIds((old) => {
      const next = old.includes(key)
        ? old.filter((x) => x !== key)
        : [...old, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function reset() {
    setSearch("");
    setDebounced("");
    setQuickLocation("All");
    setState("All");
    setCity("All");
    setCompany("All");
    setCategory("All");
    setJobType("All");
    setWorkMode("All");
    setSortBy("recent");
    setSavedOnly(false);
    setPage(1);
    setSelectedKey(null);
  }
  function change<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
    setSelectedKey(null);
  }
  function switchTab(next: Tab) {
    if (next === tab) return;
    setTab(next);
    reset();
    setError("");
    const url = new URL(window.location.href);
    if (next === "careers") url.searchParams.set("tab", "careers");
    else url.searchParams.delete("tab");
    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }
  function changeCountry(value: string) {
    if (
      value !== "ALL" &&
      !ALL_JOB_COUNTRIES.some((item) => item.code === value)
    ) {
      return;
    }

    setCountryCode(value);
    setQuickLocation("All");
    setState("All");
    setCity("All");
    setCompany("All");
    setCategory("All");
    setJobType("All");
    setWorkMode("All");
    setPage(1);
    setSelectedKey(null);
    setAvailableCompanies([]);
    setAvailableCities([]);
    setAvailableStates([]);
  }

  function chooseQuickLocation(value: string) {
    setQuickLocation(value);
    setState("All");
    setCity("All");
    if (value !== "All") {
      const region = INDIA_REGIONS.find((r) => r.cities.includes(value));
      if (region) setState(region.name);
      setCity(value);
    }
    setPage(1);
    setSelectedKey(null);
  }
  function applyPds(id: string) {
    window.dispatchEvent(
      new CustomEvent("career-job-selected", { detail: { jobId: id } }),
    );
    document
      .getElementById("apply")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (pds) return;
    const abort = new AbortController();
    const qs = new URLSearchParams();
    if (countryCode !== "ALL") qs.set("countryCode", countryCode);
    if (state !== "All") qs.set("state", state);
    fetch(`/api/jobs/filter-options?${qs}`, {
      signal: abort.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json() as Promise<{
          success: boolean;
          companies?: Array<{ key: string; name: string }>;
          cities?: string[];
          states?: string[];
        }>;
      })
      .then((d) => {
        if (!d.success || abort.signal.aborted) return;
        setAvailableCompanies((d.companies || []).map((x) => [x.key, x.name]));
        setAvailableCities(d.cities || []);
        setAvailableStates(d.states || []);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [pds, state, countryCode]);
  useEffect(() => {
    if (pds || !savedLoaded) return;
    const abort = new AbortController();
    const qs = new URLSearchParams({
      scope: "global",
      page: String(page),
      limit: String(PAGE_SIZE),
      sortBy,
    });
    if (countryCode !== "ALL") qs.set("countryCode", countryCode);
    if (state !== "All") qs.set("state", state);
    if (city !== "All") qs.set("city", city);
    if (company !== "All") qs.set("companyKey", company);
    if (category !== "All") qs.set("category", category);
    if (jobType !== "All") qs.set("type", jobType);
    if (workMode !== "All") qs.set("workMode", workMode);
    if (debounced.trim()) qs.set("search", debounced.trim());
    if (savedOnly)
      qs.set(
        "savedIds",
        savedIds.filter((x) => !x.startsWith("pds-career-")).join(","),
      );
    setLoading(true);
    setError("");
    fetch(`/api/jobs?${qs}`, { signal: abort.signal, cache: "no-store" })
      .then(async (r) => {
        const d: JobsApi = await r.json();
        if (!r.ok || !d.success || !Array.isArray(d.jobs))
          throw Error(d.error || "Unable to load jobs");
        return d;
      })
      .then((d) => {
        if (abort.signal.aborted) return;
        setItems(d.jobs || []);
        setExternalTotal(d.total || 0);
        setExternalPages(d.totalPages || 0);
      })
      .catch((e: unknown) => {
        if (abort.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Unable to load jobs");
        setItems([]);
        setExternalTotal(0);
        setExternalPages(0);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [
    pds,
    savedLoaded,
    page,
    countryCode,
    state,
    city,
    company,
    category,
    jobType,
    workMode,
    sortBy,
    debounced,
    savedOnly,
    savedIds,
  ]);

  const companies = useMemo(() => {
    if (pds)
      return [["pds", "Prime Digital School"]] as Array<[string, string]>;
    if (availableCompanies.length) return availableCompanies;
    const map = new Map<string, string>();
    for (const s of sources) map.set(s.key, s.name);
    for (const j of jobs) map.set(j.companyKey, j.company);
    return [...map].sort((a, b) => a[1].localeCompare(b[1]));
  }, [pds, availableCompanies, sources, jobs]);
  const categories = useMemo(
    () =>
      pds
        ? [...new Set(pdsJobs.map((x) => x.department))].filter(Boolean).sort()
        : [
            ...new Set([
              "Technology",
              "Banking & Finance",
              "Consulting",
              "Engineering",
              "Consumer & Retail",
              "Media & Internet",
              "Conglomerate",
              ...jobs.map((x) => x.category),
            ]),
          ]
            .filter(Boolean)
            .sort(),
    [pds, pdsJobs, jobs],
  );
  const cities = useMemo(() => {
    if (!pds && countryCode !== "IN") {
      return [...new Set(availableCities)].sort();
    }

    if (state === "All") return [];

    const region = INDIA_REGIONS.find((r) => r.name === state);

    return [
      ...new Set(
        !pds && availableCities.length ? availableCities : region?.cities || [],
      ),
    ].sort();
  }, [pds, countryCode, state, availableCities]);
  const pdsFiltered = useMemo(
    () =>
      pdsJobs
        .filter((j) => {
          const q = debounced.toLowerCase().trim();
          if (
            q &&
            ![
              j.title,
              j.department,
              j.location,
              j.description,
              j.requirements,
              j.responsibilities,
            ].some((v) => v.toLowerCase().includes(q))
          )
            return false;
          if (state !== "All") {
            const region = INDIA_REGIONS.find((r) => r.name === state);
            if (
              !j.location.toLowerCase().includes(state.toLowerCase()) &&
              !region?.cities.some((c) =>
                j.location.toLowerCase().includes(c.toLowerCase()),
              )
            )
              return false;
          }
          if (
            city !== "All" &&
            !j.location.toLowerCase().includes(city.toLowerCase())
          )
            return false;
          if (company !== "All" && company !== "pds") return false;
          if (category !== "All" && j.department !== category) return false;
          if (jobType !== "All" && normal(j.employmentType) !== normal(jobType))
            return false;
          if (workMode !== "All" && normal(j.workMode) !== normal(workMode))
            return false;
          if (savedOnly && !savedIds.includes(`pds-career-${j.id}`))
            return false;
          return true;
        })
        .sort((a, b) =>
          sortBy === "title"
            ? a.title.localeCompare(b.title)
            : sortBy === "location"
              ? a.location.localeCompare(b.location)
              : sortBy === "company"
                ? a.department.localeCompare(b.department)
                : Number(b.featured) - Number(a.featured),
        ),
    [
      pdsJobs,
      debounced,
      state,
      city,
      company,
      category,
      jobType,
      workMode,
      savedOnly,
      savedIds,
      sortBy,
    ],
  );
  const total = pds ? pdsFiltered.length : externalTotal;
  const totalPages = pds ? Math.ceil(total / PAGE_SIZE) : externalPages;
  const visible: DisplayJob[] = pds
    ? pdsFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((j) => ({
        key: `pds-career-${j.id}`,
        id: j.id,
        title: j.title,
        company: "Prime Digital School",
        location: j.location,
        type: j.employmentType,
        category: j.department,
        mode: j.workMode,
        source: "careers",
        pds: j,
      }))
    : items.map((j) => ({
        key: j.id,
        id: j.id,
        title: j.title,
        company: j.company,
        location: locationOf(j),
        type: j.type,
        category: j.category,
        mode: j.workMode,
        source: "jobs",
        external: j,
      }));
  const selected =
    visible.find((x) => x.key === selectedKey) || visible[0] || null;
  const savedCount = savedIds.filter((x) =>
    pds ? x.startsWith("pds-career-") : !x.startsWith("pds-career-"),
  ).length;
  const activeFilters = [
    !pds && countryCode !== "IN",
    state !== "All",
    city !== "All",
    company !== "All",
    category !== "All",
    jobType !== "All",
    workMode !== "All",
    savedOnly,
  ].filter(Boolean).length;
  const emptyPds =
    pds && pdsJobs.length === 0 && !savedOnly && !search && !activeFilters;

  return (
    <main className="min-h-screen bg-[#f8f7f6] text-[#231c20]">
      {/* CAREERS HERO */}
      <section className="bg-gradient-to-r from-[#97002c] via-[#790021] to-[#510019] text-white">
        <div className="mx-auto max-w-[1600px] px-5 pb-7 pt-28 sm:px-8 sm:pt-32 lg:px-10">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.85fr)]">
            <div>
              <h1 className="mt-4 text-[30px] font-extrabold tracking-tight sm:text-[38px] lg:text-[42px]">
                Discover your next opportunity
              </h1>

              <p className="mt-2 max-w-[660px] text-sm leading-6 text-white/85 sm:text-base">
                Explore opportunities from leading employers across India and
                beyond, including careers at Prime Digital School.
              </p>
            </div>

            <div
              className="relative flex min-w-0 items-center gap-1.5 rounded-xl bg-white p-1.5 shadow-[0_14px_35px_rgba(35,0,13,.15)]"
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setSuggestionsOpen(false);
                }
              }}
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 text-[#790021]">
                <Search size={19} className="shrink-0" />

                <span className="sr-only">Search jobs</span>

                <input
                  value={search}
                  onChange={(e) => {
                    change(setSearch, e.target.value);
                    setSuggestionsOpen(true);
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSuggestionsOpen(false);
                    }
                    if (e.key === "Enter") {
                      setSuggestionsOpen(false);
                      document
                        .getElementById("browse-jobs")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={suggestionsOpen && search.trim().length >= 2}
                  placeholder={
                    pds
                      ? "Search PDS jobs or departments"
                      : "Job title, keyword or company"
                  }
                  className="h-11 w-full min-w-0 bg-transparent text-sm text-[#231c20] outline-none placeholder:text-[#8c8589]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => change(setSearch, "")}
                    aria-label="Clear search"
                    className="shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <a
                href="#browse-jobs"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#790021] px-4 text-xs font-bold text-white transition hover:bg-[#5b0019] sm:px-6 sm:text-sm"
              >
                Search Jobs
                <ArrowRight size={16} className="hidden sm:block" />
              </a>

              {suggestionsOpen && search.trim().length >= 2 && (
                <div
                  role="group"
                  aria-label="Suggested job roles"
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[340px] overflow-y-auto rounded-xl border border-[#eadce1] bg-white p-2 text-[#231c20] shadow-[0_22px_55px_rgba(30,0,12,0.20)]"
                >
                  <div className="border-b border-[#f0e8eb] px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#790021]">
                      Suggested Job Roles
                    </p>
                  </div>
                  {[...new Set(JOB_ROLE_TERMS)]
                    .filter((role) =>
                      role.toLowerCase().includes(search.trim().toLowerCase()),
                    )
                    .slice(0, 8)
                    .map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          change(setSearch, role);
                          setSuggestionsOpen(false);

                          document
                            .getElementById("browse-jobs")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#fff2f6] focus:bg-[#fff2f6] focus:outline-none"
                      >
                        <Search size={17} className="shrink-0 text-[#790021]" />

                        <span className="min-w-0 flex-1 text-sm font-semibold text-[#261b20]">
                          {role}
                        </span>

                        <ArrowRight
                          size={15}
                          className="shrink-0 text-[#790021]"
                        />
                      </button>
                    ))}

                  {!JOB_ROLE_TERMS.some((role) =>
                    role.toLowerCase().includes(search.trim().toLowerCase()),
                  ) && (
                    <div className="px-3 py-4 text-sm text-[#776b70]">
                      No suggested roles found. Press Search Jobs to search all
                      vacancies.
                    </div>
                  )}

                  <div className="border-t border-[#f0e8eb] px-3 py-2 text-center text-[11px] text-[#877a7f]">
                    Select a role to search available jobs
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN JOB BOARD */}
      <div
        id="browse-jobs"
        className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-6 sm:px-8 lg:px-10"
      >
        <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* LEFT FILTER SIDEBAR */}
          <aside
            aria-label="Job filters"
            className="rounded-2xl border border-[#eee6e8] bg-white p-5 shadow-[0_4px_24px_rgba(35,0,13,.045)] lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold text-[#790021]">
                <SlidersHorizontal size={20} />
                Filter jobs
              </h2>

              <button
                type="button"
                onClick={() => setMoreFilters((value) => !value)}
                className="rounded-lg border border-[#eadce1] p-2 text-[#790021] lg:hidden"
                aria-label="Toggle job filters"
                aria-expanded={moreFilters}
              >
                <ChevronDown
                  size={17}
                  className={moreFilters ? "rotate-180" : ""}
                />
              </button>
            </div>

            <div
              className={`${moreFilters ? "block" : "hidden"} mt-5 space-y-4 lg:block`}
            >
              {!pds && (
                <label className="block space-y-2">
                  <span className="text-xs font-bold text-[#342a2e]">
                    Location / Country
                  </span>

                  <select
                    value={countryCode}
                    onChange={(e) => changeCountry(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">All Countries</option>

                    {ALL_JOB_COUNTRIES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  {pds || countryCode === "IN"
                    ? "State / UT"
                    : "State / Region"}
                </span>

                <select
                  value={state}
                  onChange={(e) => {
                    change(setState, e.target.value);
                    setCity("All");
                    setQuickLocation("All");
                  }}
                  className={inputClass}
                >
                  <option value="All">All states / regions</option>

                  {(pds || countryCode === "IN"
                    ? INDIA_REGIONS.map((region) => ({
                        code: region.code,
                        name: region.name,
                      }))
                    : availableStates.map((name) => ({
                        code: name,
                        name,
                      }))
                  ).map((region) => (
                    <option key={region.code} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>

              {cities.length > 0 && (
                <label className="block space-y-2">
                  <span className="text-xs font-bold text-[#342a2e]">City</span>

                  <select
                    value={city}
                    onChange={(e) => change(setCity, e.target.value)}
                    className={inputClass}
                  >
                    <option value="All">All cities</option>

                    {cities.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  {pds ? "Department" : "Industry"}
                </span>

                <select
                  value={category}
                  onChange={(e) => change(setCategory, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">
                    {pds ? "All departments" : "All industries"}
                  </option>

                  {categories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Employment type
                </span>

                <select
                  value={jobType}
                  onChange={(e) => change(setJobType, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All employment types</option>

                  {(pds
                    ? [
                        "Full Time",
                        "Part Time",
                        "Internship",
                        "Contract",
                        "Freelance",
                      ]
                    : [
                        "Job",
                        "Full-time",
                        "Part-time",
                        "Internship",
                        "Apprenticeship",
                        "Contract",
                        "Temporary",
                      ]
                  ).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Work mode
                </span>

                <select
                  value={workMode}
                  onChange={(e) => change(setWorkMode, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All work modes</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-[#342a2e]">
                  Company
                </span>

                <select
                  value={company}
                  onChange={(e) => change(setCompany, e.target.value)}
                  className={inputClass}
                >
                  <option value="All">All companies</option>

                  {companies.map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="border-t border-[#eee7e9] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    if (!pds) changeCountry("ALL");
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#790021] hover:underline"
                >
                  <X size={16} />
                  Reset filters
                </button>
              </div>
            </div>
          </aside>

          {/* CENTRAL JOB LISTINGS */}
          <section
            className="min-w-0 w-full space-y-4"
            aria-label="Job opportunities"
          >
            <div className="rounded-2xl border border-[#eee6e8] bg-white p-4 shadow-[0_4px_24px_rgba(35,0,13,.045)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                    {loading && !pds
                      ? "Loading jobs..."
                      : `${total.toLocaleString("en-IN")} jobs found`}
                  </h2>

                  <p className="mt-1 text-xs text-[#786b70]">
                    {pds
                      ? "Official Prime Digital School vacancies"
                      : countryCode === "ALL"
                        ? "Explore opportunities across all countries"
                        : `Opportunities in ${
                            ALL_JOB_COUNTRIES.find(
                              (item) => item.code === countryCode,
                            )?.name ?? "your selected country"
                          }`}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-xs text-[#62565b]">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(e) => change(setSortBy, e.target.value)}
                    className="h-10 max-w-[190px] rounded-lg border border-[#ded6d9] bg-white px-3 text-xs outline-none focus:border-[#790021]"
                  >
                    <option value="recent">
                      {pds ? "Featured first" : "Recently discovered"}
                    </option>
                    <option value="company">Company A-Z</option>
                    <option value="title">Job title A-Z</option>
                    <option value="location">Location A-Z</option>
                  </select>
                </label>
              </div>

              {/* JOB SOURCE TABS */}
              <div
                role="tablist"
                aria-label="Job source"
                className="mt-5 flex gap-5 overflow-x-auto border-b border-[#eee7e9] sm:gap-8"
              >
                {(
                  [
                    ["jobs", "Explore Opportunities"],
                    ["careers", "Prime Digital School Careers"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={tab === value}
                    onClick={() => switchTab(value)}
                    className={`min-h-12 shrink-0 border-b-[3px] px-1 text-xs font-bold transition sm:text-sm ${
                      tab === value
                        ? "border-[#790021] text-[#790021]"
                        : "border-transparent text-[#6d6367] hover:text-[#790021]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#65585d]">
                  <ShieldCheck size={15} className="text-[#790021]" />

                  {pds
                    ? "Official PDS career opportunities"
                    : "Employer career-site links"}
                </span>

                <button
                  type="button"
                  onClick={() => change(setSavedOnly, !savedOnly)}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition ${
                    savedOnly
                      ? "border-[#790021] bg-[#790021] text-white"
                      : "border-[#eadce1] bg-white text-[#790021] hover:bg-[#fff5f8]"
                  }`}
                >
                  <Bookmark size={15} />
                  {savedOnly ? "Showing saved" : "Saved jobs"}
                  <span>({savedCount})</span>
                </button>
              </div>
            </div>

            {error && !pds && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {loading && !pds && (
              <div className="rounded-xl border border-[#eee6e8] bg-white p-5 text-sm text-[#6b6064]">
                Fetching the latest job opportunities...
              </div>
            )}

            {!loading && visible.length === 0 && (
              <div className="rounded-2xl border border-[#eee6e8] bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fbedf1] text-[#790021]">
                  <BriefcaseBusiness size={28} />
                </div>

                <h3 className="mt-5 text-xl font-extrabold">
                  {emptyPds
                    ? "No open roles right now"
                    : "No matching jobs found"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#73696c]">
                  {emptyPds
                    ? "There are currently no published Prime Digital School vacancies. You may still submit your CV for future consideration."
                    : "Try adjusting your search or changing the selected filters."}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {pds && (
                    <a href="#apply" className={primary}>
                      Send your CV
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={pds ? () => switchTab("jobs") : reset}
                    className={outline}
                  >
                    {pds ? "Explore other jobs" : "Reset filters"}
                  </button>
                </div>
              </div>
            )}

            {/* JOB CARDS */}
            {visible.map((job) => {
              const saved = savedIds.includes(job.key);
              const expanded = selectedKey === job.key;
              const officialUrl = https(job.external?.officialUrl);

              return (
                <article
                  key={job.key}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-[0_4px_22px_rgba(35,0,13,.045)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(35,0,13,.09)] ${
                    expanded
                      ? "border-[#790021]"
                      : "border-[#eee5e8] hover:border-[#d9b8c2]"
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <Logo name={job.company} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedKey(expanded ? null : job.key)
                          }
                          className="text-left text-base font-extrabold leading-6 text-[#231c20] hover:text-[#790021] sm:text-lg"
                        >
                          {job.title}
                        </button>

                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#655b60]">
                          <Building2 size={14} />
                          {job.company}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={saved ? "Unsave job" : "Save job"}
                        aria-pressed={saved}
                        onClick={() => save(job.key)}
                        className="shrink-0 rounded-lg p-2 text-[#790021] hover:bg-[#fff1f5]"
                      >
                        <Bookmark
                          size={20}
                          fill={saved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[job.location, job.type, job.mode, job.category]
                        .filter(Boolean)
                        .map((value, index) => (
                          <span
                            key={`${index}-${value}`}
                            className="inline-flex items-center gap-1 rounded-full bg-[#f7f4f2] px-3 py-1.5 text-[11px] font-medium text-[#625b5e]"
                          >
                            {index === 0 && <Building2 size={12} />}
                            {index === 1 && <BriefcaseBusiness size={12} />}
                            {value}
                          </span>
                        ))}
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6a6064]">
                      {job.pds?.description ||
                        "Explore this opportunity, review the complete job requirements, and apply through the employer's official careers website."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ebed] pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedKey(expanded ? null : job.key)
                        }
                        aria-expanded={expanded}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#790021] hover:underline sm:text-sm"
                      >
                        {expanded ? "Hide details" : "View details"}

                        <ArrowRight
                          size={15}
                          className={expanded ? "rotate-90" : ""}
                        />
                      </button>

                      {job.pds ? (
                        <button
                          type="button"
                          onClick={() => applyPds(job.id)}
                          className={primary}
                        >
                          Apply now
                          <ArrowRight size={14} />
                        </button>
                      ) : officialUrl ? (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={primary}
                        >
                          Apply now
                          <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <a
                          href={`/job-connect/${encodeURIComponent(job.id)}`}
                          className={outline}
                        >
                          View job page
                          <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED JOB DETAILS */}
                  {expanded && (
                    <div className="border-t border-[#eee4e7] bg-[#fdfbfc] p-5 sm:p-6">
                      <h3 className="text-lg font-extrabold text-[#790021]">
                        Opportunity details
                      </h3>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Company", job.company],
                          ["Location", job.location],
                          ["Employment type", job.type],
                          [job.pds ? "Department" : "Industry", job.category],
                          ["Work mode", job.mode || "Not specified"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-xl border border-[#eee6e8] bg-white p-3"
                          >
                            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#91858a]">
                              {label}
                            </dt>

                            <dd className="mt-1 text-sm font-bold text-[#342a2e]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <h4 className="mt-5 text-sm font-extrabold">
                        About this opportunity
                      </h4>

                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#655a5f]">
                        {job.pds?.description ||
                          "Review the official employer listing for the complete responsibilities, experience requirements, eligibility criteria and application details."}
                      </p>

                      {job.pds && (
                        <>
                          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                              [
                                "Experience",
                                job.pds.experience || "Not specified",
                              ],
                              ["Vacancies", String(job.pds.vacancies)],
                              [
                                "Compensation",
                                job.pds.salary || "Not specified",
                              ],
                              ["Deadline", dateLabel(job.pds.deadline)],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="rounded-xl bg-[#f5eff1] p-3"
                              >
                                <dt className="text-xs text-[#766a6e]">
                                  {label}
                                </dt>

                                <dd className="mt-1 text-sm font-bold">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          {[
                            ["Responsibilities", job.pds.responsibilities],
                            ["Requirements", job.pds.requirements],
                          ].map(([heading, value]) =>
                            value ? (
                              <div key={heading} className="mt-5">
                                <h4 className="text-sm font-extrabold">
                                  {heading}
                                </h4>

                                <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-[#655a5f]">
                                  {paragraphs(value).map((line, index) => (
                                    <li key={index}>{line}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null,
                          )}
                        </>
                      )}

                      {job.external && (
                        <div className="mt-5 rounded-xl border border-[#eee1e5] bg-white p-4 text-xs leading-6 text-[#6e6368]">
                          Applications are completed through the employer&apos;s
                          official career website. Please confirm that the
                          vacancy remains open before applying.
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        {job.external && (
                          <a
                            href={`/job-connect/${encodeURIComponent(job.id)}`}
                            className={outline}
                          >
                            Full job page
                            <ArrowRight size={14} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => save(job.key)}
                          className={outline}
                        >
                          {savedIds.includes(job.key) ? (
                            <Check size={14} />
                          ) : (
                            <Bookmark size={14} />
                          )}

                          {savedIds.includes(job.key) ? "Saved" : "Save job"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                aria-label="Job pagination"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eee6e8] bg-white p-4"
              >
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => {
                    setPage((value) => Math.max(1, value - 1));
                    setSelectedKey(null);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#790021] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="text-xs font-semibold text-[#63595e]">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => {
                    setPage((value) => value + 1);
                    setSelectedKey(null);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#790021] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </nav>
            )}
          </section>
        </div>

        {/* ORIGINAL PDS APPLICATION WORKFLOW */}
        {pds && (
          <div className="mt-12">
            <CareerApplicationForm jobs={pdsJobs} />
          </div>
        )}
      </div>
    </main>
  );
}
