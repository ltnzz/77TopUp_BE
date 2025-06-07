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
      url: "https://www.instagram.com/ltnzzzz?igsh=MWZrcXdjNWtwM2F4Zw==", 
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
    "/77topup/admin/game/add": {
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
                  name: { type: "string", description: "Name of the game." },
                  image: { type: "string", format: "binary", description: "Game thumbnail image file." },
                  slug: { type: "string", description: "Unique URL-friendly slug for the game." },
                  description: { type: "string", description: "Detailed description of the game." },
                  price: { type: "number", format: "float", description: "Base price of the game." },
                },
                required: ["name", "slug", "description", "price", "image"], 
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
                  id_game: { type: "string", description: "ID of the game to update." },
                  name: { type: "string", description: "Updated name of the game." },
                  description: { type: "string", description: "Updated description of the game." },
                  description: { type: "string", description: "Detailed description of the game." },
                  type: { type: "string", description: "Only Mobile and PC" },

                },
                required: ["id_game"],
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
                  id_game: { type: "string", description: "ID of the game to disable." },
                },
                required: ["id_game"],
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
                  id_game: { type: "string", description: "ID of the game to enable." },
                },
                required: ["id_game"],
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
    "/77topup/admin/delete": {
      delete: {
        summary: "Permanently delete a game by its ID.",
        tags: ["Admin - Games"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_game: { type: "string", description: "ID of the game to enable." },
                },
                required: ["id_game"],
              },
            },
          },
        },
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
                  id_game: { type: "string", description: "ID of the game this package belongs to." },
                  name: { type: "string", description: "Name of the package (e.g., '100 Diamonds')." },
                  image: { type: "string", format: "binary", description: "Package icon/image file." },
                  image_public_id: { type: "string", format: "binary", description: "Package icon/image file." },
                  tag: { type: "string", description: "Tag for promo on packages" },
                  price: { type: "number", format: "float", description: "Price of the package." },
                  description: { type: "string", description: "Description for the packages." }
                },
                required: ["id_game", "name", "price", "tag", "description"],
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
                  id_game: { type: "string", description: "ID of the game this package belongs to." },
                  id_packages: { type: "string", description: "ID of the package belongs to." },
                  name: { type: "string", description: "Name of the package (e.g., '100 Diamonds')." },
                  image: { type: "string", format: "binary", description: "Package icon/image file." },
                  image_public_id: { type: "string", format: "binary", description: "Package icon/image file." },
                  tag: { type: "string", description: "Tag for promo on packages" },
                  price: { type: "number", format: "float", description: "Price of the package." },
                  description: { type: "string", description: "Description for the packages." }
                },
                required: ["id_game", "name", "price", "tag", "description"],
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
                  id_packages: { type: "string", description: "ID of the package to enable." },
                },
                required: ["id_packages"],
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
                  id_packages: { type: "string", description: "ID of the package to disable." },
                },
                required: ["id_packages"],
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
    "/77topup/admin/package/delete": {
      delete: {
        summary: "Permanently delete a game package by its ID.",
        tags: ["Admin - Packages"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id_packages: { type: "string", description: "ID of the package to disable." },
                },
                required: ["id_packages"],
              },
            },
          },
        },
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
                required: ["id_packages"],
                properties: {
                  id_packages: { type: "string", description: "ID of the package being purchased." },
                  username: { type: "string", description: "Name of the account on the website." },
                  email: { type: "string", format: "email", description: "Email of the customer." },
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

    // GENERAL ROUTES
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
          id_game: { type: "string", description: "Unique ID of the game." },
          name: { type: "string", description: "Name of the game." },
          ihsangan_slug: { type: "string", description: "SEO-friendly slug for the game (unique)." },
          description: { type: "string", description: "Detailed description of the game." },
          type: { type: "string", description: "Type of game (e.g., 'Mobile', 'PC')." }, // Menambahkan type
          imageUrl: { type: "string", format: "url", description: "URL to the game's main image." },
          imagePublicId: { type: "string", description: "Public ID of the image for Cloudinary management." },
          active: { type: "boolean", description: "Indicates if the game is currently active and visible." },
          is_using_server: { type: "boolean", description: "Indicates if the game is currently using server or not." },
          createdAt: { type: "string", format: "date-time", description: "Timestamp when the game was created." },
          updatedAt: { type: "string", format: "date-time", description: "Timestamp when the game was last updated." },
        },
        example: {
          id_game: "65c72b2f9f1b2c001c8e4d2a",
          name: "Mobile Legends: Bang Bang",
          ihsangan_slug: "ml",
          description: "5v5 MOBA game on mobile.",
          type: "Mobile", // Contoh type
          imageUrl: "https://example.com/mlbb.jpg",
          imagePublicId: "games/Mobile_Legends",
          active: true,
          is_using_server: true,
          createdAt: "2023-01-01T12:00:00Z",
          updatedAt: "2023-01-05T15:30:00Z"
        }
      },
      Package: {
        type: "object",
        properties: {
          id_packages: { type: "string", description: "Unique ID of the package." },
          gameid: { type: "string", description: "ID of the game this package belongs to." }, // Menggunakan gameid
          name: { type: "string", description: "Name or quantity of the package (e.g., '100 Diamonds', 'Weekly Pass')." }, // Sesuaikan dengan 'name'
          price: { type: "number", format: "float", description: "Price of this specific package." },
          tag: { type: "string", description: "Tag for promo on packages (e.g., 'Best Seller', 'New')." }, // Menambahkan tag
          description: { type: "string", description: "Description for the packages." }, // Menambahkan description
          imageUrl: { type: "string", format: "url", description: "URL to the package's icon/image." },
          imagePublicId: { type: "string", description: "Public ID of the image for Cloudinary management." }, // Tambahkan imagePublicId
          active: { type: "boolean", description: "Indicates if the package is currently active and available." },
          createdAt: { type: "string", format: "date-time", description: "Timestamp when the package was created." },
          updatedAt: { type: "string", format: "date-time", description: "Timestamp when the package was last updated." },
        },
        example: {
          id_packages: "65c72b2f9f1b2c001c8e4d2b",
          gameid: "65c72b2f9f1b2c001c8e4d2a",
          name: "500 Diamonds",
          price: 50000.00,
          tag: "Terlaris",
          description: "Dapatkan 500 diamond Mobile Legends.",
          imageUrl: "https://example.com/500_diamonds.png",
          imagePublicId: "packages/500_diamonds",
          active: true,
          createdAt: "2023-01-02T10:00:00Z",
          updatedAt: "2023-01-02T10:00:00Z"
        }
      },
      UserSignUp: {
        type: "object",
        required: ["email", "password", "confirmPassword", "username"],
        properties: {
          email: { type: "string", format: "email", description: "User's unique email address.", example: "user@example.com" },
          username: { type: "string", description: "User's chosen username (unique).", example: "johndoe" },
          password: { type: "string", format: "password", description: "User's chosen password (min 6 characters).", minLength: 6, example: "StrongPass123" },
          confirmPassword: { type: "string", format: "password", description: "Confirm user's password (must match password).", minLength: 6, example: "StrongPass123" }, // Tambahan
          // phoneNumber dihapus jika tidak ada di logic signup kamu
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