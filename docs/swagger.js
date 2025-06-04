// docs/swagger.js

/**
 * @fileoverview OpenAPI specification for the 77TopUp API.
 * This file exports a JavaScript object containing the OpenAPI 3.0 specification,
 * which can be directly used by swagger-ui-express.
 */

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "77TopUp API Documentation",
    version: "1.0.0", 
    description: "API documentation for the 77TopUp website. This document describes all available endpoints for users and administrators.",
    contact: {
      name: "77TopUp Support",
      url: "http://example.com/support", 
      email: "tujuhtujuhtopup@gmail.com", 
    },
  },
  servers: [
    {
      // url: "http://localhost:3000", 
      // description: "Development server (Localhost)",
    },
    
    {
      url: "https://77-top-up-be.vercel.app/",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User and Admin authentication & authorization related operations.",
    },
    {
      name: "Games",
      description: "Public-facing API for retrieving game information.",
    },
    {
      name: "Admin - Games",
      description: "Administrator-only API for managing games (add, edit, disable, enable, delete).",
    },
    {
      name: "Admin - Packages",
      description: "Administrator-only API for managing game packages (add, edit, disable, enable, delete).",
    },
    {
      name: "Midtrans",
      description: "Endpoints for Midtrans payment gateway integration and webhooks.",
    },
    {
      name: "General",
      description: "General utilities like image upload and search functionality.",
    },
  ],
  paths: {
    // AUTHENTICATION ROUTES
    "/77topup/sign-up": {
      post: {
        summary: "Register a new user account.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserSignUp",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User created successfully" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Invalid input data or user already exists.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Email already registered" }
                  }
                }
              }
            }
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },
    "/77topup/sign-in": {
      post: {
        summary: "Authenticate a user and get an access token.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserSignIn",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User logged in successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", description: "JWT authentication token." },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        username: { type: "string" },
                        email: { type: "string", format: "email" },
                        // tambahkan properti user lainnya yang dikembalikan
                      }
                    }
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid email or password.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Invalid credentials" }
                  }
                }
              }
            }
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },
    "/77topup/admin/login": {
      post: {
        summary: "Admin login. Sends an OTP to the admin's registered email/phone.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdminLogin",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OTP sent successfully to admin's registered contact.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "OTP sent to admin email/phone" }
                  }
                }
              }
            }
          },
          "401": {
            description: "Invalid admin credentials or account not found.",
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },
    "/77topup/admin/verify": {
      post: {
        summary: "Verify Admin OTP to complete login and get an access token.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdminVerifyOTP",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Admin verified successfully, token provided.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", description: "JWT authentication token for admin access." },
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid or expired OTP.",
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },

    // GAMES ROUTES (PUBLIC)
    "/77topup/homepage": {
      get: {
        summary: "Retrieve a list of all active games for the public homepage.",
        tags: ["Games"],
        responses: {
          "200": {
            description: "Successfully retrieved list of games.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },
    "/77topup/{slug}": {
      get: {
        summary: "Retrieve detailed information about a specific game by its slug.",
        tags: ["Games"],
        parameters: [
          {
            in: "path",
            name: "slug",
            schema: {
              type: "string",
            },
            required: true,
            description: "The unique slug identifier of the game.",
            example: "mobile-legends",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved game details.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Game",
                },
              },
            },
          },
          "404": {
            description: "Game with the specified slug not found.",
          },
          "500": {
            description: "Internal server error.",
          },
        },
      },
    },

    // ADMIN - GAMES ROUTES
    "/77topup/admin/homepage": { // This route is actually in adminRouter.js, but duplicated for context in public spec
      get: {
        summary: "Retrieve a list of all games (including disabled) for admin dashboard.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Successfully retrieved list of games.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized - missing or invalid token" },
          "403": { description: "Forbidden - insufficient permissions" },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/add": {
      post: {
        summary: "Add a new game to the system.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary", description: "Game thumbnail image file." },
                  name: { type: "string", description: "Name of the game." },
                  slug: { type: "string", description: "Unique URL-friendly slug for the game." },
                  description: { type: "string", description: "Detailed description of the game." },
                  price: { type: "number", format: "float", description: "Base price of the game." },
                  // Tambahkan properti game lain yang mungkin diperlukan
                },
                required: ["name", "slug", "description", "price", "image"], // Sesuaikan jika ada yang opsional
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Game added successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Game"
                }
              }
            }
          },
          "400": { description: "Invalid input or game with this slug/name already exists." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/game/edit": {
      put: {
        summary: "Update details of an existing game.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  gameId: { type: "string", description: "ID of the game to update." },
                  name: { type: "string", description: "Updated name of the game." },
                  slug: { type: "string", description: "Updated slug for the game." },
                  description: { type: "string", description: "Updated description of the game." },
                  price: { type: "number", format: "float", description: "Updated base price of the game." },
                  // Tambahkan properti lain yang bisa diupdate
                },
                required: ["gameId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Game updated successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Game"
                }
              }
            }
          },
          "400": { description: "Invalid input or game not found." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Game not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/edit/game/disable": {
      put: {
        summary: "Disable a game, making it inactive for public view/purchase.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  gameId: { type: "string", description: "ID of the game to disable." },
                },
                required: ["gameId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Game disabled successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Game disabled successfully" }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid input." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Game not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/edit/game/enable": {
      put: {
        summary: "Enable a game, making it active and visible for public view/purchase.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  gameId: { type: "string", description: "ID of the game to enable." },
                },
                required: ["gameId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Game enabled successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Game enabled successfully" }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid input." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Game not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/delete/{gameId}": {
      delete: {
        summary: "Permanently delete a game by its ID.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "gameId",
            schema: {
              type: "string",
            },
            required: true,
            description: "ID of the game to delete.",
            example: "60c72b2f9f1b2c001c8e4d2a", // Contoh ID
          },
        ],
        responses: {
          "200": {
            description: "Game deleted successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Game deleted successfully" }
                  }
                }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Game not found." },
          "500": { description: "Internal server error." },
        },
      },
    },

    // ADMIN - PACKAGES ROUTES
    "/77topup/admin/package/add": {
      post: {
        summary: "Add a new package for a specific game.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary", description: "Package icon/image file." },
                  gameId: { type: "string", description: "ID of the game this package belongs to." },
                  packageName: { type: "string", description: "Name of the package (e.g., '100 Diamonds')." },
                  price: { type: "number", format: "float", description: "Price of the package." },
                  // Tambahkan properti package lain
                },
                required: ["gameId", "packageName", "price", "image"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Package added successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Package"
                }
              }
            }
          },
          "400": { description: "Invalid input or game/package already exists." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/package/edit": {
      put: {
        summary: "Update details of an existing game package.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  packageId: { type: "string", description: "ID of the package to update." },
                  packageName: { type: "string", description: "Updated name of the package." },
                  price: { type: "number", format: "float", description: "Updated price of the package." },
                  // Tambahkan properti lain yang bisa diupdate
                },
                required: ["packageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Package updated successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Package"
                }
              }
            }
          },
          "400": { description: "Invalid input or package not found." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Package not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/package/enable": {
      put: {
        summary: "Enable a game package, making it active and available for purchase.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  packageId: { type: "string", description: "ID of the package to enable." },
                },
                required: ["packageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Package enabled successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Package enabled successfully" }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid input." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Package not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/package/disable": {
      put: {
        summary: "Disable a game package, making it inactive and unavailable for purchase.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  packageId: { type: "string", description: "ID of the package to disable." },
                },
                required: ["packageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Package disabled successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Package disabled successfully" }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid input." },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Package not found." },
          "500": { description: "Internal server error." },
        },
      },
    },
    "/77topup/admin/package/delete/{packageId}": {
      delete: {
        summary: "Permanently delete a game package by its ID.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "packageId",
            schema: {
              type: "string",
            },
            required: true,
            description: "ID of the package to delete.",
            example: "60c72b2f9f1b2c001c8e4d2b", // Contoh ID
          },
        ],
        responses: {
          "200": {
            description: "Package deleted successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Package deleted successfully" }
                  }
                }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Package not found." },
          "500": { description: "Internal server error." },
        },
      },
    },

    // MIDTRANS ROUTES
    "/pay/{timestamp}": {
      post: {
        summary: "Initiate a new payment transaction via Midtrans.",
        tags: ["Midtrans"],
        parameters: [
          {
            in: "path",
            name: "timestamp",
            schema: { type: "string" },
            required: true,
            description: "A unique timestamp to identify the transaction request.",
            example: "1678886400000", // Contoh timestamp Unix
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "customerName", "customerEmail", "gameId", "packageId"],
                properties: {
                  amount: { type: "number", format: "float", description: "The total transaction amount." },
                  customerName: { type: "string", description: "Name of the customer." },
                  customerEmail: { type: "string", format: "email", description: "Email of the customer." },
                  gameId: { type: "string", description: "ID of the game being purchased." },
                  packageId: { type: "string", description: "ID of the package being purchased." },
                  // Tambahkan properti lain yang relevan untuk transaksi, misal: user_id, item_details
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Transaction successfully initiated. Returns Midtrans redirect URL.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    redirect_url: { type: "string", format: "url", description: "URL to redirect the user for payment." },
                    transaction_id: { type: "string", description: "Unique ID generated for this transaction." },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid input or payment details." },
          "500": { description: "Internal server error or Midtrans API error." },
        },
      },
    },
    "/midtrans-webhook": {
      post: {
        summary: "Midtrans webhook endpoint to receive transaction status updates.",
        tags: ["Midtrans"],
        description: "This endpoint is called by Midtrans servers to notify about transaction status changes (e.g., success, pending, failed).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Transaction",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook received and processed successfully (always return 200 OK to Midtrans).",
          },
          "500": {
            description: "Internal server error during webhook processing (Midtrans will retry).",
          },
        },
      },
    },

    // GENERAL ROUTES
    "/upload": {
      post: {
        summary: "Upload a single image file to cloud storage.",
        tags: ["General"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "The image file to upload.",
                  },
                },
                required: ["image"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Image uploaded successfully. Returns the URL of the uploaded image.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    url: { type: "string", format: "url", description: "URL of the uploaded image." },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error during upload.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Error uploading image" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/search": {
      get: {
        summary: "Search for games by name or description.",
        tags: ["General"],
        parameters: [
          {
            in: "query",
            name: "",
            schema: { type: "string" },
            required: true,
            description: "The search query string for games.",
            example: "mobile",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved search results.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error during search.",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Bearer token in the format `Bearer <token>` to access secured endpoints."
      },
    },
    schemas: {
      Game: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique ID of the game." },
          name: { type: "string", description: "Name of the game." },
          slug: { type: "string", description: "SEO-friendly slug for the game (unique)." },
          description: { type: "string", description: "Detailed description of the game." },
          price: { type: "number", format: "float", description: "Base price of the game." },
          imageUrl: { type: "string", format: "url", description: "URL to the game's main image." },
          active: { type: "boolean", description: "Indicates if the game is currently active and visible." },
          createdAt: { type: "string", format: "date-time", description: "Timestamp when the game was created." },
          updatedAt: { type: "string", format: "date-time", description: "Timestamp when the game was last updated." },
        },
        example: {
          id: "65c72b2f9f1b2c001c8e4d2a",
          name: "Mobile Legends: Bang Bang",
          slug: "mobile-legends",
          description: "5v5 MOBA game on mobile.",
          price: 10000.00,
          imageUrl: "https://example.com/mlbb.jpg",
          active: true,
          createdAt: "2023-01-01T12:00:00Z",
          updatedAt: "2023-01-05T15:30:00Z"
        }
      },
      Package: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique ID of the package." },
          gameId: { type: "string", description: "ID of the game this package belongs to." },
          packageName: { type: "string", description: "Name or quantity of the package (e.g., '100 Diamonds', 'Weekly Pass')." },
          price: { type: "number", format: "float", description: "Price of this specific package." },
          imageUrl: { type: "string", format: "url", description: "URL to the package's icon/image." },
          active: { type: "boolean", description: "Indicates if the package is currently active and available." },
          createdAt: { type: "string", format: "date-time", description: "Timestamp when the package was created." },
          updatedAt: { type: "string", format: "date-time", description: "Timestamp when the package was last updated." },
        },
        example: {
          id: "65c72b2f9f1b2c001c8e4d2b",
          gameId: "65c72b2f9f1b2c001c8e4d2a",
          packageName: "500 Diamonds",
          price: 50000.00,
          imageUrl: "https://example.com/500_diamonds.png",
          active: true,
          createdAt: "2023-01-02T10:00:00Z",
          updatedAt: "2023-01-02T10:00:00Z"
        }
      },
      UserSignUp: {
        type: "object",
        required: ["email", "password", "phoneNumber", "username"],
        properties: {
          email: { type: "string", format: "email", description: "User's unique email address.", example: "user@example.com" },
          password: { type: "string", format: "password", description: "User's chosen password (min 6 characters).", minLength: 6, example: "StrongPass123" },
          phoneNumber: { type: "string", description: "User's phone number.", example: "+6281234567890" },
          username: { type: "string", description: "User's chosen username (unique).", example: "johndoe" },
        },
      },
      UserSignIn: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", description: "User's email address.", example: "user@example.com" },
          password: { type: "string", format: "password", description: "User's password.", example: "StrongPass123" },
        },
      },
      AdminLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", description: "Admin's registered email address.", example: "admin@77topup.com" },
          password: { type: "string", format: "password", description: "Admin's password.", example: "AdminPass123" },
        },
      },
      AdminVerifyOTP: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: { type: "string", format: "email", description: "Admin's email address.", example: "admin@77topup.com" },
          otp: { type: "string", description: "One-Time Password received by admin (e.g., via email/SMS).", example: "123456" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "Unique order ID from Midtrans.", example: "ORDER-12345-ABCDE" },
          transaction_status: { type: "string", description: "Status of the transaction (e.g., 'settlement', 'pending', 'deny', 'cancel', 'expire').", example: "settlement" },
          gross_amount: { type: "string", description: "Total amount of the transaction.", example: "50000.00" },
          payment_type: { type: "string", description: "Method of payment (e.g., 'credit_card', 'bank_transfer').", example: "gopay" },
          transaction_time: { type: "string", format: "date-time", description: "Timestamp of the transaction.", example: "2023-03-15 10:00:00" },
          currency: { type: "string", description: "Currency of the transaction.", example: "IDR" },
          status_code: { type: "string", description: "Midtrans status code.", example: "200" }
        },
      },
    },
  },
};