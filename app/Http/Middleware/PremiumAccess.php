<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PremiumAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Simple check for premium access (Subscriber or above, or Super Admin)
        if (! $request->user() || ! in_array($request->user()->role, ['subscriber', 'super_admin'])) {
            return redirect('/premium/subscribe')->with('error', 'You need an active subscription to access this content.');
        }
        // Could also verify active status in 'subscriptions' table

        return $next($request);
    }
}
