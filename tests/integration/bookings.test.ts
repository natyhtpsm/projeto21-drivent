import app, { init } from "@/app";
import { prisma } from "@/config";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createUser, createEnrollmentWithAddress, createPayment, createTicket, createTicketType } from "../factories";