export const providers: Array<{
    name: string,
    prefix: string,
    categories: {
        [name: string]: Array<{
            url: string,
            name: string,
            params?: string[],
            optionalParams?: string[],
        }>,
    },
}> = [
        {
            name: "shields.io",
            prefix: "https://img.shields.io/",
            categories: {
                Custom: [
                    {
                        name: "Custom",
                        params: ["label", "message", "color"],
                        optionalParams: ["logo"],
                        url: "badge/{{label}}-{{message}}-{{color}}?logo={{logo}}",
                    },
                ],
                GitHub: [
                    {
                        name: "License",
                        params: ["user", "repo"],
                        optionalParams: ["color"],
                        url: "github/license/{{user}}/{{repo}}.svg?color={{color}}",
                    },
                    {
                        name: "Last commit",
                        params: ["user", "repo"],
                        optionalParams: ["color"],
                        url: "github/last-commit/{{user}}/{{repo}}?color={{color}}",
                    },
                ],
                Other: [
                    {
                        name: "Maintenance",
                        params: ["status", "year"],
                        url: "maintenance/{{status}}/{{year}}",
                    },
                ],
            },
        },
        {
            name: "TravisCI",
            prefix: "https://travis-ci.org/",
            categories: {
                Status: [
                    {
                        name: "Build Status",
                        url: "{{user}}/{{repo}}.svg?branch={{branch}}",
                        params: ["user", "repo", "branch"],
                    },
                ],
            },
        },
        {
            name: "Dependabot",
            prefix: "https://api.dependabot.com/badges/",
            categories: {
                Status: [
                    {
                        name: "Dependency Status",
                        url: "status?host=github&repo={{user}}/{{repo}}",
                        params: ["user", "repo"],
                    },
                ],
            },
        },
        {
            name: "GitHub",
            prefix: "https://github.com/",
            categories: {
                Actions: [
                    {
                        name: "Workflow Status",
                        url: "{{user}}/{{repo}}/workflows/{{workflow}}/badge.svg",
                        params: ["user", "repo", "workflow"],
                    },
                ],
            },
        },
        {
            name: "AppVeyor",
            prefix: "https://ci.appveyor.com/api/projects/",
            categories: {
                Status: [
                    {
                        name: "Status",
                        url: "status/github/{{user}}/{{repo}}",
                        params: ["user", "repo"],
                    },
                ],
            },
        },
        {
            name: "Gitter",
            prefix: "https://badges.gitter.im/",
            categories: {
                Join: [
                    {
                        name: "Join Chat",
                        url: "Join%20Chat.svg",
                    },
                ],
            },
        },
    ];
